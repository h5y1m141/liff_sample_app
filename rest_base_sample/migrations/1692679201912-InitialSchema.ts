import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1692679201912 implements MigrationInterface {
    name = 'InitialSchema1692679201912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "restaurants" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "seats" (
                "id" SERIAL NOT NULL,
                "restaurant_id" integer NOT NULL,
                "number_of_seats" integer NOT NULL,
                "start_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "end_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "PK_3fbc74bb4638600c506dcb777a7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "reservations" (
                "id" SERIAL NOT NULL,
                "seat_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "REL_9de00b2fb6ea7532d17367d081" UNIQUE ("seat_id"),
                CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "seats"
            ADD CONSTRAINT "FK_4d1bc0b876a6ec675e9be8277ed" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "FK_9de00b2fb6ea7532d17367d0810" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reservations" DROP CONSTRAINT "FK_9de00b2fb6ea7532d17367d0810"
        `);
        await queryRunner.query(`
            ALTER TABLE "seats" DROP CONSTRAINT "FK_4d1bc0b876a6ec675e9be8277ed"
        `);
        await queryRunner.query(`
            DROP TABLE "reservations"
        `);
        await queryRunner.query(`
            DROP TABLE "seats"
        `);
        await queryRunner.query(`
            DROP TABLE "restaurants"
        `);
    }

}
