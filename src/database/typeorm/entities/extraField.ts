import { Entity, Column, PrimaryGeneratedColumn, Relation, ManyToOne } from "typeorm"
import { Merchant } from "./merchant"

@Entity()
export class ExtraField {
    @PrimaryGeneratedColumn()
    id?: number

    @ManyToOne(() => Merchant, (merchant) => merchant.extraFields, { onDelete:'CASCADE' })
    merchant?: Relation<Merchant> 

    @Column({ nullable:false })
    name?:string
}
