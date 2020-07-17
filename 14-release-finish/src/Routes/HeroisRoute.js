const Joi = require('joi')
const Boom = require('boom')
const Base = require('./base/BaseRoute')
const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

const failAction = (request, header, error) =>{
    throw error
}
class HeroisRoute extends Base {
    
    constructor(Db){
        super()
        this._dataBase = Db;
    }

    list(){
        return{
            path:'/herois',
            method: 'GET',
            config:{
                tags:['api'],
                description: 'Api de consulta',
                notes:'Api disponibiliza recursos de paginação',
                validate:{
                    failAction,
                    headers,
                    query: Joi.object({
                        limit: Joi.number().integer().default(0),
                        skip : Joi.number().integer().default(0),
                        nome : Joi.string()
                    })
                }
            },
            handler: async (request)=>{
                try {
                    
                    const {nome, skip, limit} = request.query
                    //console.log('GET', request.query)
                    return await this._dataBase.search(nome, limit, skip)
                    
                } catch (error) {
                    console.log('Falha na requisição GET', error)
                    return Boom.internal()
                }
            }
        }
    }

    create(){
        return{
            path:'/herois',
            method:'POST',
            config:{
              description: 'Api de cadastro',
              notes:'Api disponibiliza o recurso de adicionar um novo heroi no banco',
              tags : ['api'],
                validate:{
                    headers,
                    failAction,
                    payload: Joi.object({
                                nome: Joi.string().required(),
                                poder: Joi.string().required()
                            })
                }
            },
            handler: async (request) =>{
                try {
                    const{nome, poder} = request.payload
                    const result = this._dataBase.create({nome, poder})
                    return{
                        message:'Dados gravados com Sucesso!',
                        id: result.id
                    }
                    
                } catch (e) {
                    console.log('Falha na requisição POST', e)
                    return Boom.internal()
                }
            }
        }
    }

    update(){
        return{
            path:'/herois/{id}',
            method:'PATCH',
            config:{
                description: 'Api de update',
                notes:'Api disponibiliza o recurso de Atualizar heroi no banco via id',
                tags : ['api'],
                validate:{
                    headers,
                    failAction,
                    params : Joi.object({
                        id: Joi.number().integer().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string(),
                        poder: Joi.string()
                    })
                },
                handler: async (request) =>{
                    try {
                        const {id} = request.params
                        const {payload} = request
                        const aux = JSON.stringify(payload)
                        const dados = JSON.parse(aux)
                       
                        const result =  await this._dataBase.update(id, dados)
                        //console.log(result)
                        if(result === 0){
                            return {
                              message : Boom.preconditionFailed('Falha ao atualizar as informações'),
                              nModified : result
                            }
                        }

                        return{
                            message : 'Dados atualizados com sucesso',
                            nModified : result
                        }
                    } catch (error) {
                       console.log('Falha na requisição PATCH', error) 
                       return Boom.internal()
                    }
                }
            }
        }
    }

    delete(){
        return{
            path:'/herois/{id}',
            method:'DELETE',
            config:{
                description: 'Api de delete',
                notes:'Api disponibiliza o recurso de remover um heroi no banco',
                tags : ['api'],
                validate:{
                    headers,
                    failAction,
                    params: Joi.object({
                        id : Joi.number().integer().required()
                    })
                }
            },
            handler: async (request)=>{
                try {
                    const {id} = request.params
                    return await this._dataBase.delete(id)
                } catch (error) {
                    console.log('Falha na requisição DELETE', error)
                    return Boom.internal()
                }
            }
        }
    }

}

module.exports = HeroisRoute