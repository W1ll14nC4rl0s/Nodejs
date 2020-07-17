const Jwt = require('jsonwebtoken')
const Joi = require('joi')
const Bomm = require('boom')
const Base = require('./base/BaseRoute')
const PasswordHelper = require('../helpers/PasswordHelper')
const Boom = require('boom')
const failAction = (request, header, error) =>{
    throw error
}

class AuthRoutes extends Base{
    
    constructor(db, key){
       
        super()
        this._key = key
        this._dataBase = db
    }

    signIn(){
        return{
            path:'/signin',
            method: 'POST',
            config:{
                auth: false,
                tags:['api'],
                description:'Realiza o cadastro de um novo usuario',
                notes:'gera o token para o novo usuário',
                validate:{
                    failAction,
                    payload: Joi.object({
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request)=>{

                const{email, password} = request.payload
                //console.log('PAYLOAD', this._dataBase)
                const user = await this._dataBase.searchUser(email)
                //console.log('PAYLOAD', user)
                if(user.length !== 0){
                    return{
                        message: Boom.preconditionFailed('Email já cadastrado')
                    }
                }
                //console.log('PAYLOAD', password)
                const token =  await PasswordHelper.hashPassword(password)
                //console.log('PAYLOAD', token)
                const obj = {
                    email,
                    password:token
                }
              
                const result = await this._dataBase.create(obj)
                //console.log('RESULT', result)
                const auth = Jwt.sign(
                    {
                        email : result.email, 
                        _id: result._id

                    }, this._key)
                //console.log('PAYLOAD', auth)
                return {auth}
                
              

            }
        }
    } 

    login(){
        return{
            path:'/login',
            method:'POST',
            config:{
                auth: false,
                tags:['api'],
                description:'Serviço que realiza a validação para login',
                notes:'O serviço valida apenas o email e senha',
                validate:{
                    failAction,
                    payload: Joi.object({
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async(request)=>{
                const{email, password} = request.payload
                const [validUser] = await this._dataBase.searchUser(email)
                //console.log('BUSCA_USER', validUser)
                if(!validUser){
                    return{
                        message: Boom.preconditionFailed('usuario ou senha invalidos')
                    }
                }
               
                const validPass = await PasswordHelper.ComparePassword(password, validUser.password)
                //console.log('BUSCA_USER', validPass)
                if(validPass){
                   
                   const token = Jwt.sign({
                        email: validUser.email,
                        _id : validUser._id
                    }, this._key)
                   
                    return {token}
                }

                return{
                    message:Boom.preconditionFailed('usuario ou senha invalido')
                }
            }
        }
    }
}

module.exports = AuthRoutes