import { MigrationInterface, QueryRunner } from "typeorm";

export class origin1673273396154 implements MigrationInterface {
    name = 'origin1673273396154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`extra_field\` DROP COLUMN \`value\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`extra_field\` ADD \`value\` varchar(255) NOT NULL`);
    }

}
