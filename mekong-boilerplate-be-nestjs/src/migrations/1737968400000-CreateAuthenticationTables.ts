import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthenticationTables1737968400000 implements MigrationInterface {
  name = 'CreateAuthenticationTables1737968400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum for user roles
    await queryRunner.query(`
      CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'manager', 'member')
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "name" character varying,
        "image" character varying,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'member',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create index on email column for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email")
    `);

    // Create oauth_accounts table
    await queryRunner.query(`
      CREATE TABLE "oauth_accounts" (
        "id" SERIAL NOT NULL,
        "provider" character varying NOT NULL,
        "providerId" character varying NOT NULL,
        "userId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_oauth_accounts_provider_providerId" UNIQUE ("provider", "providerId"),
        CONSTRAINT "PK_oauth_accounts_id" PRIMARY KEY ("id")
      )
    `);

    // Create foreign key for oauth_accounts -> users
    await queryRunner.query(`
      ALTER TABLE "oauth_accounts"
      ADD CONSTRAINT "FK_oauth_accounts_userId"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Create index on userId for faster joins
    await queryRunner.query(`
      CREATE INDEX "IDX_oauth_accounts_userId" ON "oauth_accounts" ("userId")
    `);

    // Create magic_link_tokens table
    await queryRunner.query(`
      CREATE TABLE "magic_link_tokens" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "token" character varying NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "used" boolean NOT NULL DEFAULT false,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_magic_link_tokens_token" UNIQUE ("token"),
        CONSTRAINT "PK_magic_link_tokens_id" PRIMARY KEY ("id")
      )
    `);

    // Create index on email and token for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_magic_link_tokens_email" ON "magic_link_tokens" ("email")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_magic_link_tokens_token" ON "magic_link_tokens" ("token")
    `);

    // Create refresh_tokens table
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" SERIAL NOT NULL,
        "token" character varying NOT NULL,
        "userId" integer NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "revoked" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_refresh_tokens_token" UNIQUE ("token"),
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id")
      )
    `);

    // Create foreign key for refresh_tokens -> users
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens"
      ADD CONSTRAINT "FK_refresh_tokens_userId"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Create index on userId for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_tokens_userId" ON "refresh_tokens" ("userId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop refresh_tokens table
    await queryRunner.query(`DROP INDEX "public"."IDX_refresh_tokens_userId"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_userId"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);

    // Drop magic_link_tokens table
    await queryRunner.query(`DROP INDEX "public"."IDX_magic_link_tokens_token"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_magic_link_tokens_email"`);
    await queryRunner.query(`DROP TABLE "magic_link_tokens"`);

    // Drop oauth_accounts table
    await queryRunner.query(`DROP INDEX "public"."IDX_oauth_accounts_userId"`);
    await queryRunner.query(`ALTER TABLE "oauth_accounts" DROP CONSTRAINT "FK_oauth_accounts_userId"`);
    await queryRunner.query(`DROP TABLE "oauth_accounts"`);

    // Drop users table
    await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop user role enum
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
