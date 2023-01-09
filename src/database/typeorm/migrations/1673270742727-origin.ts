import { MigrationInterface, QueryRunner } from "typeorm";

export class origin1673270742727 implements MigrationInterface {
    name = 'origin1673270742727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`extra_field\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`merchantId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`extra_field\` ADD CONSTRAINT \`FK_10b69218409981fe947440ddc8d\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`extra_field\` DROP FOREIGN KEY \`FK_10b69218409981fe947440ddc8d\``);
        await queryRunner.query(`DROP TABLE \`extra_field\``);
    }
}
