import Joi, { required } from 'joi'

const id=Joi.number();
const name=Joi.string().min(3).max(30);
const description=Joi.string().max(100);
const price=Joi.number();
const quantity=Joi.number();
const merchantId = Joi.number();

const createProductSchema=Joi.object({
    name:name.required(),
    description: description.required(),
    price: price.required(),
    quantity: quantity.required(),
});

const updateProductSchema=Joi.object({
    name:name.required(),
    description: description.required(),
    price: price.required(),
    quantity: quantity.required(),
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

export {createProductSchema,updateProductSchema,getProductSchema, filterProductSchema}