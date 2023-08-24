This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Firestore に対してテストデータを登録する

以下のように実行することでテストデータを投入できます

### レストランデータ

```sh
node scripts/seed_bookable_tables.js '{"start_datetime": "2023-08-25T11:00:00.000Z","end_datetime": "2023-08-25T16:00:00.000Z","duration": 1,"available_reservation_requests": 4, "restaurant_name": "すし田中", "latitude": 35.658034, "longitude": 139.701636}'

node scripts/seed_bookable_tables.js '{"start_datetime": "2023-08-25T11:00:00.000Z","end_datetime": "2023-08-26T16:00:00.000Z","duration": 1,"available_reservation_requests": 4, "restaurant_name": "洋食こいずみ", "latitude": 35.691348, "longitude": 139.70336}'

node scripts/seed_bookable_tables.js '{"start_datetime": "2023-08-25T11:00:00.000Z","end_datetime": "2023-08-28T16:00:00.000Z","duration": 1,"available_reservation_requests": 4, "restaurant_name": "てんぷら鶴吉", "latitude": 35.646715, "longitude": 139.710082 }'
```

### ユーザー

```sh
node scripts/seed_user.js '{"name": "勝生勇利"}'
```

もしもローカルのエミュレーターに対して登録をしたい場合は .env に

```
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
```

と記述して

```sh
firebase emulators:start
```

でローカルの Firestore のエミュレーターを起動しておきます。

その上で前述のスクリプトを実施することでエミュレーターに対して処理が実施されます

## staging

ステージング環境のブランチがあるのでそちらを利用する

## production

本番環境のブランチがあるのでそちらを利用する
