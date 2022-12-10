import { MigrationInterface, QueryRunner } from "typeorm";

export class experienceYearCount1670668096450 implements MigrationInterface {
    name = 'experienceYearCount1670668096450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "experience_year_count" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "experience_year_count"`);
    }

}
