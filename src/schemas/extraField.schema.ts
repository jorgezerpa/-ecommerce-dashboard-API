import Joi from 'joi'


const id=Joi.number();
// const name = Joi.string().max(30)
const extrafield = { name: Joi.string().max(30).required() }
const extraFields = Joi.array().items(extrafield)

const createExtraFieldsSchema=Joi.object({
    extraFields: extraFields.required()
});

const updateExtraFieldSchema=Joi.object(extrafield);

const getExtraFieldSchema=Joi.object({
    extraFieldId:id.required(),
});

export {createExtraFieldsSchema, updateExtraFieldSchema, getExtraFieldSchema}