import boom from "@hapi/boom"
import { AuthMerchant } from "../database/typeorm/entities"
import AppDataSource from "../database/typeorm"
import nodeMailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import config from "../config"
import bcrypt from '../utils/bcrypt'

const authMerchantModel = AppDataSource.getRepository(AuthMerchant)

const authService = {
    findOneByEmail: async function(email: string){
        const auth = await authMerchantModel.findOne({where: { email:email }, relations:{merchant:true} })        
        if(!auth){
            throw boom.notFound('auth not found')
        }  
        return auth
    },

    sendRecoveryEmail: async function(email:string){
        const user = await authMerchantModel.findOne({where: { email:email }, relations:{merchant:true} })        
        if(!user) throw boom.unauthorized('unauthorized')
        delete user.password //VERY IMPORTANTTT!!!!!!!!!
        const payload = {id:user.id}
        const token = jwt.sign(payload, config.JWT_RECOVERY_SECRET, {expiresIn: '10min'})
        await authMerchantModel.save({...user, recoveryToken:token})
        const emailInfo = {
            from: 'jorgezerpacoder@gmail.com', // sender address
            to: `${user.email}`, // list of receivers
            subject: "correo de recuperación", // Subject line
            html: `click aquí para setear una nueva contraseña <b>https://mifrontend.com/recovery-password?recovery-token=${token}</b>`, // html body
          }
        const result = await this.sendMail(emailInfo)
        return result
    },

    changePassword: async function(token:string, newPassword:string){
      const payload = jwt.verify(token, config.JWT_RECOVERY_SECRET) as AuthMerchant
      const user = await authMerchantModel.findOneBy({id:payload.id})
      console.log(token)
      console.log(user?.recoveryToken)
      if(!user) throw boom.unauthorized('unauthorized')
      if(user?.recoveryToken!==token) throw boom.unauthorized('unauthorized')
      const hashedPassword = await bcrypt.hashPassword(newPassword)
      const result = await authMerchantModel.save({...user, password: hashedPassword, recoveryToken: ''})
      return 'password changed'
    },

    sendMail: async function(emailInfo:{}){
        const transporter = nodeMailer.createTransport({
          host: "smtp.gmail.com",
          secure: true, // true for 465, false for other ports
          port: 465,
          auth: {
            user: 'jorgezerpacoder@gmail.com',
            pass: config.GMAIL_KEY
          }
        });
        await transporter.sendMail(emailInfo, (err)=>{
            if(err)throw boom.internal('unespected error. Can not send mail')
        });
        return { message: 'mail sent' };
      }
}


export default authService
