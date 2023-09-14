import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRestaurantCourses1694068465478 implements MigrationInterface {
    name = 'CreateRestaurantCourses1694068465478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "restaurant_courses" (
                "id" SERIAL NOT NULL,
                "restaurant_id" integer NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "PK_29760ef68558dea6201b963183a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "restaurant_courses"
            ADD CONSTRAINT "FK_cf229bbb822417d6e8c52354df1" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "restaurant_courses" DROP CONSTRAINT "FK_cf229bbb822417d6e8c52354df1"
        `);
        await queryRunner.query(`
            DROP TABLE "restaurant_courses"
        `);
    }

}
