import boom from "@hapi/boom"
import generatePassword from 'generate-password'
import { Merchant } from "../database/typeorm/entities/merchant"
import { ExtraField } from "../database/typeorm/entities/extraField"
import { AuthMerchant as Auth } from "../database/typeorm/entities"
import AppDataSource from "../database/typeorm"
import encrypt from "../utils/bcrypt"

const merchantModel = AppDataSource.getRepository(Merchant)
const extraFieldModel = AppDataSource.getRepository(ExtraField)
const authModel = AppDataSource.getRepository(Auth)

const merchantService = {
    get: async function(merchantId:number){
        const extraFields = await extraFieldModel.find({where:{ merchant: { id:merchantId } }})
        if(!extraFields) throw boom.badRequest("can not get extraFields")
        return extraFields
    },
    // findOne: async function(merchantId: number){
    //     const merchant = await merchantModel.findOneBy({id:merchantId})
    //     if(!merchant){
    //         throw boom.notFound('merchant not found')
    //     }
    //     return merchant    
    // },
    createExtraFields: async function(merchantId:number, extraFields:any){
        console.log('efff',extraFields)
        const merchant = await merchantModel.findOneBy({ id:merchantId })
        if(!merchant) throw boom.badRequest('merchant not found')
        await Promise.all(extraFields.map( async(ef:any) => {
            const newEF = new ExtraField()
            newEF.name = ef.name
            newEF.merchant = merchant
            await extraFieldModel.save(newEF)
        }))
        const merchantWithNewEF = await merchantModel.findOne({ where:{ id:merchantId }, relations:{ extraFields:true } })
        if(!merchantWithNewEF || !merchantWithNewEF.extraFields) throw boom.internal('internal error creating EF')
        return merchantWithNewEF.extraFields
    },
    update: async function(merchantId:number, extraFieldId:number, changes:any){
        const efToUpdate = await extraFieldModel.findOne({ where: { id: extraFieldId, merchant: { id: merchantId } } })
        if(!efToUpdate) throw boom.notFound('merchant to update not found')
        const newEF = { ...efToUpdate, ...changes }
        const result = await extraFieldModel.save(newEF)
        return result 
    },
    delete: async function(merchantId:number, extraFieldId:number ){
        const extraField = await extraFieldModel.findOne({where:{id:extraFieldId, merchant:{id:merchantId}}})
        if(!extraField) throw boom.badRequest('error on delete extrafield')
        await extraFieldModel.remove(extraField)
        return `extraField ${extraFieldId} deleted`
    },
}

export default merchantService
