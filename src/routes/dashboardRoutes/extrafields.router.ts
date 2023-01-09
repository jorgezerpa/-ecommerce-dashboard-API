import express, { Router, Response, Request, NextFunction } from 'express'
import passport from "passport"
import extraFieldsService from '../../services/extraFields.service'
import { createExtraFieldsSchema, updateExtraFieldSchema, getExtraFieldSchema } from '../../schemas/extraField.schema'
import validatorHandler from '../../middlewares/validator.handler'
import { handleResponse } from '../../responses/response'

const router:Router = express.Router();

router.get('/', passport.authenticate('jwt', {session:false}),  async(req:Request, res:Response, next:NextFunction) => {
  try {
    let merchantId = req.user?.sub as number
    const extraField = await extraFieldsService.get(merchantId);
    handleResponse(res, 200, 'extraField', {extraField})
  } catch (error) {
    next(error)
  }
});

router.post('/', passport.authenticate('jwt', {session:false}), validatorHandler(createExtraFieldsSchema, 'body'), async(req:Request, res:Response, next:NextFunction) => {
  try {
    const merchantId = req.user?.sub as number
    //extra fields comes in array form
    const { extraFields } = req.body
    const extraFieldsResult = await extraFieldsService.createExtraFields(merchantId,extraFields);
    handleResponse(res, 201, 'extrafields created', {extraFieldsResult})
  } catch (error) {
    next(error)
  }
});

router.patch('/update/:extraFieldId', passport.authenticate('jwt', {session:false}), validatorHandler(updateExtraFieldSchema, 'body'), async(req:Request, res:Response, next:NextFunction) => {
  try {
    let merchantId = req.user?.sub as number
    let extraFieldId = parseInt(req.params.extraFieldId) 
    const changes = req.body
    const merchant = await extraFieldsService.update(merchantId, extraFieldId, changes);
    handleResponse(res, 200, 'merchant updated', {merchant})
  } catch (error) {
    next(error)
  }
});

router.delete('/:extraFieldId',passport.authenticate('jwt', {session:false}), validatorHandler(getExtraFieldSchema, 'params'), async(req:Request, res:Response, next:NextFunction) => {
  try {
    let merchantId = req.user?.sub as number
    let extraFieldId = parseInt(req.params.extraFieldId)
    const result = await extraFieldsService.delete(merchantId, extraFieldId)
    handleResponse(res, 200, result, {})
  } catch (error) {
    next(error)
  }
});

// router.get('/client-credentials', passport.authenticate('jwt', {session:false}),  async(req:Request, res:Response, next:NextFunction) => {
//   try {
//     let id = req.user?.sub as number
//     const merchantCredentials = await merchantService.getClientCredentials(id);
//     handleResponse(res, 200, 'merchant credentials', {merchantCredentials})
//   } catch (error) {
//     next(error)
//   }
// });

export default router;
