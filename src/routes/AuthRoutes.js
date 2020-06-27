const jwt = require('jsonwebtoken')
const Joi = require('joi')
const Boom = require('boom')
const Base = require('./base/BaseRoute')
const passwordHelper = require('../helpers/passwordHelper')
const failAction = (request, header, error) =>{
    throw error
}
const VALID_USER = {
    username: 'Willian',
    password: '12345'
}
class AuthRoutes extends Base{

    constructor(key, db){
        super();
        this._key = key;
        this._database = db;

        //console.log('database', this._database)
    }

    login(){
        return{
            path:'/login',
            method: 'POST',
            config:{
                auth: false, //desabilitar a autenticação
                tags:['api'],
                description:'Obter Token',
                notes:'Realizar autenticação de usuario',
                validate:{
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request) =>{
                 
                const {
                    username,
                    password
                } = request.payload

                const [user] = await this._database.read({username})
                //console.log('user', user)
                if(!user) {
                    return Boom.unauthorized('O Usuário  ou a senha invalidos')
                }
                //console.log('senha', senha, user.password)
                const valid = await passwordHelper.comparePassword(password, user.password)
                
                if(!valid){
                    return Boom.unauthorized('O Usuário  ou a senha invalidos')
                }
                const token = jwt.sign({
                    username: user.username,
                    id: user.id
                }, this._key)

                return{ token }
            }
        }
    }
}

module.exports = AuthRoutes