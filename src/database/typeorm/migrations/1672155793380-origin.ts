import { MigrationInterface, QueryRunner } from "typeorm";

export class origin1672155793380 implements MigrationInterface {
    name = 'origin1672155793380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`auth_merchant\` (\`id\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`recoveryToken\` varchar(255) NULL, \`clientId\` varchar(255) NOT NULL, \`clientSecret\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`merchantId\` int NULL, UNIQUE INDEX \`IDX_ae7d9a3c5f9b949dc5fa89fe78\` (\`email\`), UNIQUE INDEX \`REL_835fe9179e2572bbd1856eb9d6\` (\`merchantId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_method\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`state\` varchar(255) NOT NULL, \`order\` text NOT NULL, \`merchantId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`merchant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_546608b3c7bf7c175d3780c38f\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`imageId\` varchar(255) NULL, \`merchantId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`quantity\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`imageId\` varchar(255) NULL, \`isAvailable\` tinyint NOT NULL DEFAULT 1, \`merchantId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shipping\` (\`id\` int NOT NULL AUTO_INCREMENT, \`country\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`street\` varchar(255) NOT NULL, \`references\` varchar(255) NOT NULL, \`coordinates\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart\` (\`id\` int NOT NULL AUTO_INCREMENT, \`totalAmmount\` int NOT NULL DEFAULT '0', \`merchantId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_paypal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`merchant_payment_methods_payment_method\` (\`merchantId\` int NOT NULL, \`paymentMethodId\` int NOT NULL, INDEX \`IDX_0d66b943a761791ff223ae295d\` (\`merchantId\`), INDEX \`IDX_32131527b109a9828142a602cd\` (\`paymentMethodId\`), PRIMARY KEY (\`merchantId\`, \`paymentMethodId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_products_product\` (\`categoryId\` int NOT NULL, \`productId\` int NOT NULL, INDEX \`IDX_90d521137ff8c3e927187bcd27\` (\`categoryId\`), INDEX \`IDX_ee240b247f9f23e5d35854c186\` (\`productId\`), PRIMARY KEY (\`categoryId\`, \`productId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart_products_product\` (\`cartId\` int NOT NULL, \`productId\` int NOT NULL, INDEX \`IDX_e6ce39be5d354954a88ded1eba\` (\`cartId\`), INDEX \`IDX_0fc996e42b6330c97f8cffbddf\` (\`productId\`), PRIMARY KEY (\`cartId\`, \`productId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`auth_merchant\` ADD CONSTRAINT \`FK_835fe9179e2572bbd1856eb9d64\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_293ad75db4c3b2aa62996c75ad1\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_5f44aa02d1c66d9a916a409fcb2\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_62fcc319202f6ec1f6819e1d5f5\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_0f79a6a0fa4d42d394f0c1cc776\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`merchant_payment_methods_payment_method\` ADD CONSTRAINT \`FK_0d66b943a761791ff223ae295d1\` FOREIGN KEY (\`merchantId\`) REFERENCES \`merchant\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`merchant_payment_methods_payment_method\` ADD CONSTRAINT \`FK_32131527b109a9828142a602cdf\` FOREIGN KEY (\`paymentMethodId\`) REFERENCES \`payment_method\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_products_product\` ADD CONSTRAINT \`FK_90d521137ff8c3e927187bcd27d\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`category_products_product\` ADD CONSTRAINT \`FK_ee240b247f9f23e5d35854c186b\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_products_product\` ADD CONSTRAINT \`FK_e6ce39be5d354954a88ded1ebac\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cart_products_product\` ADD CONSTRAINT \`FK_0fc996e42b6330c97f8cffbddfa\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_products_product\` DROP FOREIGN KEY \`FK_0fc996e42b6330c97f8cffbddfa\``);
        await queryRunner.query(`ALTER TABLE \`cart_products_product\` DROP FOREIGN KEY \`FK_e6ce39be5d354954a88ded1ebac\``);
        await queryRunner.query(`ALTER TABLE \`category_products_product\` DROP FOREIGN KEY \`FK_ee240b247f9f23e5d35854c186b\``);
        await queryRunner.query(`ALTER TABLE \`category_products_product\` DROP FOREIGN KEY \`FK_90d521137ff8c3e927187bcd27d\``);
        await queryRunner.query(`ALTER TABLE \`merchant_payment_methods_payment_method\` DROP FOREIGN KEY \`FK_32131527b109a9828142a602cdf\``);
        await queryRunner.query(`ALTER TABLE \`merchant_payment_methods_payment_method\` DROP FOREIGN KEY \`FK_0d66b943a761791ff223ae295d1\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_0f79a6a0fa4d42d394f0c1cc776\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_62fcc319202f6ec1f6819e1d5f5\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_5f44aa02d1c66d9a916a409fcb2\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_293ad75db4c3b2aa62996c75ad1\``);
        await queryRunner.query(`ALTER TABLE \`auth_merchant\` DROP FOREIGN KEY \`FK_835fe9179e2572bbd1856eb9d64\``);
        await queryRunner.query(`DROP INDEX \`IDX_0fc996e42b6330c97f8cffbddf\` ON \`cart_products_product\``);
        await queryRunner.query(`DROP INDEX \`IDX_e6ce39be5d354954a88ded1eba\` ON \`cart_products_product\``);
        await queryRunner.query(`DROP TABLE \`cart_products_product\``);
        await queryRunner.query(`DROP INDEX \`IDX_ee240b247f9f23e5d35854c186\` ON \`category_products_product\``);
        await queryRunner.query(`DROP INDEX \`IDX_90d521137ff8c3e927187bcd27\` ON \`category_products_product\``);
        await queryRunner.query(`DROP TABLE \`category_products_product\``);
        await queryRunner.query(`DROP INDEX \`IDX_32131527b109a9828142a602cd\` ON \`merchant_payment_methods_payment_method\``);
        await queryRunner.query(`DROP INDEX \`IDX_0d66b943a761791ff223ae295d\` ON \`merchant_payment_methods_payment_method\``);
        await queryRunner.query(`DROP TABLE \`merchant_payment_methods_payment_method\``);
        await queryRunner.query(`DROP TABLE \`payment_paypal\``);
        await queryRunner.query(`DROP TABLE \`cart\``);
        await queryRunner.query(`DROP TABLE \`shipping\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP INDEX \`IDX_546608b3c7bf7c175d3780c38f\` ON \`merchant\``);
        await queryRunner.query(`DROP TABLE \`merchant\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`payment_method\``);
        await queryRunner.query(`DROP INDEX \`REL_835fe9179e2572bbd1856eb9d6\` ON \`auth_merchant\``);
        await queryRunner.query(`DROP INDEX \`IDX_ae7d9a3c5f9b949dc5fa89fe78\` ON \`auth_merchant\``);
        await queryRunner.query(`DROP TABLE \`auth_merchant\``);
    }

}
