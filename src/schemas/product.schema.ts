import Joi, { boolean, required } from 'joi'


const id=Joi.number();
const name=Joi.string().min(3).max(30);
const description=Joi.string().max(100);
const price=Joi.number();
const quantity=Joi.number();
const image = Joi.string();
const merchantId = Joi.number();

const createProductSchema=Joi.object({
    name:name.required(),
    description: description.required(),
    price: price.required(),
    quantity: quantity.required(),
    image: image,
});

const updateProductSchema=Joi.object({
    name: name,
    description: description,
    price: price,
    quantity: quantity,
    image: image,
});

const filterProductSchema=Joi.object({
    name:name,
    description: description,
    price: price,
    quantity: quantity,
    merchantId: merchantId,
});

const getProductSchema=Joi.object({
    id:id.required(),
});

const getProductsFilterSchema=Joi.object({
    unavailable: Joi.bool()
});

export {createProductSchema,updateProductSchema,getProductSchema, filterProductSchema, getProductsFilterSchema}