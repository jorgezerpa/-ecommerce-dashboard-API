import { Request } from 'express';
import { Strategy } from 'passport-local';
import boom from '@hapi/boom';
import encrypt from '../../bcrypt'; 
import authService from '../../../services/auth.service';

const LocalStrategy = new Strategy({
   usernameField: 'email',
   passwordField: 'password',
   passReqToCallback: true
 },
 async ({body}:Request, email:string, password:string, done) => {
   try {  
     const user = await authService.findOneByEmail(email, body.userType);
     if (!user) {
       done(boom.unauthorized(), false);  
       return
     }
     if(user.password!==undefined){
         const isMatch = await encrypt.compare(password, user.password);
         if (!isMatch) {
           done(boom.unauthorized(), false);
         }
         delete user.password
         //user['merchant'].usertype || user['client'].usertype
         user[body.userType].userType = body.userType
         done(null, user[body.userType]);
     }
   } catch (error) {
     done(error, false);
   }
 }
);

 export default LocalStrategy;



