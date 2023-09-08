import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRestaurantCourseToReservation1694133071447 implements MigrationInterface {
    name = 'AddRestaurantCourseToReservation1694133071447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD "restaurant_course_id" integer NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reservations" DROP COLUMN "restaurant_course_id"
        `);
    }

}
