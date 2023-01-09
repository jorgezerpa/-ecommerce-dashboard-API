import express, { Application } from "express"

import productsRouter from './products.router'
import categoriesRouter from './categories.router'
import merchantsRouter from './merchants.router'
import authRouter from './auth.router'
import ordersRouter from './orders.router'
import extraFieldsRouter from './extrafields.router'

const routerDashboard = express.Router()
  routerDashboard.use('/product', productsRouter);
  routerDashboard.use('/extraFields', extraFieldsRouter);
  routerDashboard.use('/category', categoriesRouter);
  routerDashboard.use('/merchant', merchantsRouter);
  routerDashboard.use('/orders', ordersRouter);
  routerDashboard.use('/auth', authRouter);

export default routerDashboard;