import { MigrationInterface, QueryRunner } from "typeorm";

export class User1670408836840 implements MigrationInterface {
    name = 'User1670408836840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstname" character varying, "lastname" character varying, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying, "gender" "public"."user_gender_enum", "bio" character varying, "profile_image" character varying, "cover_image" character varying, "address" character varying, "success_story" character varying, "skills" character varying, "facebook_url" character varying, "twitter_url" character varying, "instagram_url" character varying, "linkdln_url" character varying, "website_url" character varying, "is_top_member" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
