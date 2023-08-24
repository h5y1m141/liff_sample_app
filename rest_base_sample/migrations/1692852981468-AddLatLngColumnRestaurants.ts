import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLatLngColumnRestaurants1692852981468 implements MigrationInterface {
    name = 'AddLatLngColumnRestaurants1692852981468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "restaurants"
            ADD "latitude" numeric(9, 6) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "restaurants"
            ADD "longitude" numeric(10, 6) NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "restaurants" DROP COLUMN "longitude"
        `);
        await queryRunner.query(`
            ALTER TABLE "restaurants" DROP COLUMN "latitude"
        `);
    }

}
