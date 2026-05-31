import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSmartphonesTable1760000001000 implements MigrationInterface {
  name = 'CreateSmartphonesTable1760000001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "smartphones" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "brand" varchar NOT NULL,
        "model" varchar NOT NULL,
        "price" real NOT NULL,
        "storage" varchar NOT NULL,
        "created_at" text NOT NULL,
        "updated_at" text NOT NULL
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "smartphones"`);
  }
}
