import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773482257126 implements MigrationInterface {
    name = 'Migration1773482257126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pets_species_enum" AS ENUM('DOG', 'CAT', 'BIRD', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_status_enum" AS ENUM('AVAILABLE', 'PENDING', 'ADOPTED')`);
        await queryRunner.query(`CREATE TABLE "pets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "breed" character varying NOT NULL, "species" "public"."pets_species_enum" NOT NULL, "age" integer NOT NULL, "description" text, "imageUrl" character varying, "status" "public"."pets_status_enum" NOT NULL DEFAULT 'AVAILABLE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d01e9e7b4ada753c826720bee8b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pets"`);
        await queryRunner.query(`DROP TYPE "public"."pets_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_species_enum"`);
    }

}
