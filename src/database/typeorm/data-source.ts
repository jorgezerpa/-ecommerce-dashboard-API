import "reflect-metadata"
import config from "../../config"
import { DataSource } from "typeorm"
import { Product, AuthMerchant, Category, Merchant, PaymentMethod, Shipping, Order, Cart, ExtraField } from "./entities"
import { PaymentPaypal } from './entities/paymentMethods'
import { origin1672155793380 } from './migrations/1672155793380-origin' 
import { origin1673270742727 } from './migrations/1673270742727-origin' 
import { origin1673273396154 } from './migrations/1673273396154-origin' 

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    migrationsRun: true,
    // synchronize: true,
    logging: false,
    entities: [
        Product, AuthMerchant, Category, Merchant, PaymentMethod, Shipping,
        PaymentPaypal, Order, Cart, ExtraField
    ],
    subscribers: [],
    migrations: [origin1672155793380, origin1673270742727, origin1673273396154],
    // migrationsTableName: "custom_migration_table",
})


// //execute the first time on dev server an then comment OR change this to a migration
AppDataSource.initialize()
    .then(() => {
        console.log('DB connected')
    })
    .catch((error) => console.log('error',error))