import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    name?: string

    @Column()
    description?: string

    @Column()
    price?: number

    @Column()
    quantity?: string
    
    @Column()
    merchantId?: number
}