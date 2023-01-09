import boom from "@hapi/boom"
import generatePassword from 'generate-password'
import { Merchant } from "../database/typeorm/entities/merchant"
import { AuthMerchant as Auth } from "../database/typeorm/entities"
import AppDataSource from "../database/typeorm"
import encrypt from "../utils/bcrypt"

const merchantModel = AppDataSource.getRepository(Merchant)
const authModel = AppDataSource.getRepository(Auth)


const merchantService = {
    get: async function(){
        const result = await merchantModel.find()
        if(result.length <= 0){
            throw boom.notFound("not merchant created")
        }
        return result
    },
    findOne: async function(merchantId: number){
        const merchant = await merchantModel.findOne({where:{id:merchantId}, relations:{extraFields:true}},)
        if(!merchant){
            throw boom.notFound('merchant not found')
        }
        return merchant    
    },
    create: async function(data: Merchant, password:string){
        const merchant = new Merchant()
        merchant.lastName = data.lastName;
        merchant.firstName = data.firstName;
        merchant.email = data.email;
        merchant.phone = data.phone;
        const newMerchant = await merchantModel.save(merchant)
        if(!newMerchant) throw boom.badRequest('Can not create merchant')
    
        const auth = new Auth()
        auth.id = newMerchant.id
        auth.merchant = newMerchant
        auth.password = await encrypt.hashPassword(password);
        auth.email = data.email;
        auth.clientSecret = generatePassword.generate({ length:30, numbers:true }) 
        auth.clientId = generatePassword.generate({ length:30, numbers:true })    
        const newAuth = await authModel.save(auth)
        if(!newAuth){
            await merchantModel.remove(newMerchant) //if auth can not be created, we have to delete the created merchant
            throw boom.badRequest('can not create merchant')
        }
        delete newMerchant.auth //VERY IMPORTANT!!
        return newMerchant
    },
    update: async function(merchantId:number, changes: any){
        const merchantToUpdate = await merchantModel.findOneBy({id:merchantId})
        if(!merchantToUpdate){
            throw boom.notFound('merchant to update not found')
        }
        const newMerchant = { ...merchantToUpdate, ...changes }
        const result = await merchantModel.save(newMerchant)
        return result 
    },
    delete: async function(merchantId:number){
        const merchant = await merchantModel.findOneBy({id:merchantId})
        if(!merchant){
            throw boom.notFound('merchant to delete not found')
        }
        await merchantModel.remove(merchant)
        return `merchant ${merchantId} deleted`
    },
    getClientCredentials:async (merchantId:number) => {
        const auth = await authModel.findOneBy({ merchant:{id:merchantId} })
        if(!auth) throw boom.unauthorized('unauthorized')
        const data = { clientId: auth.clientId, clientSecret: auth.clientSecret}
        return data
    }
}

export default merchantService
