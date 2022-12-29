import boom from "@hapi/boom"
import AppDataSource from "../database/typeorm"
import { Product } from "../database/typeorm/entities/product"
import { Merchant } from "../database/typeorm/entities"
import { uploadFile, deleteFile } from '../utils/cloudinary/cloudinary'
import { productsfilter } from '../filters/products.filter'
    //types and interfaces
import { ProductsFilterQuery } from '../types/filters'

const productModel = AppDataSource.getRepository(Product)
const merchantModel = AppDataSource.getRepository(Merchant)

const PRODUCTS_FOLDER = 'products'

const productService = {
    get: async function(merchantId:number, filterOptions:ProductsFilterQuery={}){
        const filter = productsfilter(filterOptions)
        const merchant = await merchantModel.findOne({where:{id:merchantId}, relations:{products:true}})
        if(!merchant) throw boom.notFound('user not found')
        if(!merchant.products)throw boom.notFound("error getting products.") 
        const products = productModel.find({where:{merchant:merchant, ...filter}, relations:{categories:true}})       
        if(!products)throw boom.notFound("error getting products.") 
        return products
    },
    getByCategory: async function(merchantId:number, categoryId:number){
        const merchant = await merchantModel.findOne({where:{id:merchantId}, relations:{products:true, categories:true}})
        if(!merchant) throw boom.notFound('merchant not found')
        if(!merchant.products)throw boom.notFound("error getting products") 
        const categoryIndex = merchant.categories?.findIndex(category=>category.id===categoryId)
        if(categoryIndex===-1) throw boom.notFound('category not found')
        const products = await productModel.find({ where: { categories:{id:categoryId}, merchant:merchant }, relations:{categories:true}})
        if(!products) throw boom.notFound('error getting products')
        return products
    },
    findOne: async function(merchantId:number, productId: number){
        const merchant = await merchantModel.findOne({where:{id:merchantId}, relations:{products:true}})
        if(!merchant) throw boom.notFound('user not found')
        if(!merchant.products)throw boom.notFound("error getting products.")        
        const productIndex = merchant.products.findIndex(product=>product.id===productId)
        if(productIndex===-1) throw boom.notFound('product not found')
        const product = merchant.products[productIndex]
        return product    
    },
    create: async function(merchantId:number, data: Product){
        let image = ''
        let imageId = ''
        if(data.image){
            try {
                const result = await uploadFile(data.image, PRODUCTS_FOLDER)
                image = result.secure_url
                imageId = result.public_id
            } catch (error:any) {
                throw boom.internal(error)
            }
        }
        const merchant = await merchantModel.findOneBy({id:merchantId})
        if(!merchant) throw boom.notFound('merchant not found')
        const newProduct = new Product()
        newProduct.name = data.name
        newProduct.description = data.description
        newProduct.price = data.price
        newProduct.quantity = data.quantity
        newProduct.image = image
        newProduct.imageId = imageId
        newProduct.merchant = merchant
        const result = await productModel.save(newProduct)
        if(!result) throw boom.badRequest('Can not create the product')
        return result
    },
    update: async function(merchantId:number, productId:number, rawChanges: any){
        let {image, ...changes} = rawChanges
        let imageId = ''
        if(Boolean(image)){
            try {
                const newImage = await uploadFile(image, PRODUCTS_FOLDER)
                changes.image = newImage.secure_url
                changes.imageId = newImage.public_id
            } catch (error:any) {
                throw boom.internal(error)
            }
        }

        const merchant = await merchantModel.findOne({where:{id:merchantId}, relations:{products:true}})
        if(!merchant) throw boom.notFound('user not found')
        if(!merchant.products || merchant.products.length<=0 )throw boom.notFound("not products created")        
        const productIndex = merchant.products.findIndex(product=>product.id===productId)
        if(productIndex===-1) throw boom.notFound('product not found')
        const product = merchant.products[productIndex]
        if(Boolean(image) && product.imageId){
            const result = await deleteFile(product.imageId)
        }
        const updatedProduct = {...product, ...changes}
        const result = await productModel.save(updatedProduct)
        return result
    },
    delete: async function(merchantId:number, productId:number){
        const merchant = await merchantModel.findOne({where:{id:merchantId}, relations:{products:true}})
        if(!merchant) throw boom.notFound('user not found')
        if(!merchant.products || merchant.products.length<=0 )throw boom.notFound("not products created")        
        const productIndex = merchant.products.findIndex(product=>product.id===productId)
        if(productIndex===-1) throw boom.notFound('product not found')
        const product = merchant.products[productIndex]
        if(Boolean(product.image) && product.imageId){
            try {
                const result = await deleteFile(product.imageId)
            } catch (error) {
                throw boom.internal('can not delete the product, try again.')
            }
        }
        const result = await productModel.remove(product)
        return `product ${productId} deleted successfully`
    },
}

export default productService
