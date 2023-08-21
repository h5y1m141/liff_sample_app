import { Injectable, NestMiddleware } from '@nestjs/common'

import { Request, Response, NextFunction } from 'express'
import * as admin from 'firebase-admin'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private adminApp: admin.app.App

  constructor() {
    const cert = {
      projectId: process.env.FIREBASE_PROJECT_ID_OF_SERVICE_ACCOUNT,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL_OF_SERVICE_ACCOUNT,
      privateKey: process.env.FIREBASE_PRIVATE_KEY_OF_SERVICE_ACCOUNT?.replace(
        /\\n/g,
        '\n',
      ),
    }
    this.adminApp = !admin.apps.length
      ? admin.initializeApp(
          { credential: admin.credential.cert(cert) },
          'adminApp',
        )
      : admin.apps[0]
  }

  private async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return this.adminApp.auth().verifyIdToken(token)
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const token = authHeader.split(' ')[1]

    try {
      const decodedToken = await this.verifyToken(token)
      if (!decodedToken) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }
      next()
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
}
