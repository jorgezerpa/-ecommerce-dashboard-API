import boom from "@hapi/boom"
import { Product } from "../database/typeorm/entities/product"
import AppDataSource from "../database/typeorm"

const productModel = AppDataSource.getRepository(Product)

const productService = {
    get: async function(){
        const result = await productModel.find()
        if(!result){
            throw boom.notFound('products not found')
        }
        if(result.length <= 0){
            throw boom.notFound("not products created")
        }
        return result
    },
    findOne: async function(productId: number){
        const product = await productModel.findOneBy({id:productId})
        if(!product){
            throw boom.notFound('product not found')
        }
        return product    
    },
    create: async function(data: Product){
        const newProduct = await productModel.save(data)
        if(!newProduct){
            throw boom.badRequest('Can not create the product')
        }
        return newProduct
    },
    update: async function(productId:number, changes: any){
        const productToUpdate = await productModel.findOneBy({id:productId})
        if(!productToUpdate){
            throw boom.notFound('product to update not found')
        }
        const newProduct = { ...productToUpdate, ...changes }
        const result = await productModel.save(newProduct)
        return result 
    },
    delete: async function(productId:number){
        const product = await productModel.findOneBy({id:productId})
        if(!product){
            throw boom.notFound('product to delete not found')
        }
        await productModel.remove(product)
        return { productId }
    }
}

export default productService