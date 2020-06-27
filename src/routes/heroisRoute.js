const Joi = require('joi')
const Boom = require('boom')
const Base = require('./base/BaseRoute')
const failAction = (request, header, error) =>{
    throw error
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroisRoute extends Base{

    constructor(db){
        super();
        this._dataBase = db
    }

    list(){
        return{
            path:'/herois',
            method:'GET',
            config:{
                tags: ['api'],
                description: 'Api de listagem',
                notes:'Api disponibiliza paginação, e filtragem por nomes',
                validate:{
                    failAction,
                    headers,
                    query:  Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(0),
                        nome: Joi.string().min(3).max(100)
                    }) 
                }
            },
            handler:async(request)=>{
                try {
                    const {nome, limit, skip} = request.query
                    const query = nome ? {
                        nome: {$regex: `.*${nome}*.`}
                    } : {}
                    //console.log('REad', query, limit, skip)
                     
                    return this._dataBase.read(query, limit, skip)
                } catch (e) {
                    console.log('Error na requisição Get', e)
                    return Boom.internal();
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
                    failAction,
                    headers,
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
                description: 'Api de atualização',
                notes:'Api disponibiliza o recurso de atualização de um heroi já cadastrado',
                tags: ['api'],
                validate:{
                    failAction,
                    headers,
                    params: Joi.object({
                                id: Joi.string().required()
                            }),
                    payload: Joi.object({
                                nome: Joi.string().min(1).max(100),
                                poder: Joi.string().min(1).max(100)
                            })
                }
            },
            handler: async (request)=>{
                try {
        
                    const {id} = request.params
                    const {payload} = request
                    const dados = JSON.stringify(payload)
                    const dadosFinais = JSON.parse(dados)
                   
                    const result = await this._dataBase.update(id, dadosFinais)
    
                    if(result.nModified === 0){
                        return {
                            message: Boom.preconditionFailed('Id não encontrado'),
                            id: ''
                        }
    
                    }
    
                    return{
                        message: 'Dados Atualizados com sucesso!',
                        id: id
                    }
                } catch (error) {
                    console.log('Falha ao tentar atualizar os dados via PATCH')
                    return Boom.internal()
                }
            }
        }
    }
    delete(){
        return{
            path:'/herois/{id}',
            method:'DELETE',
            config:{
                description: 'Api de exclusão',
                notes:'Api disponibiliza exclusão de herois',
                tags: ['api'],
                validate:{
                    failAction,
                    headers,
                    params: Joi.object({
                                id: Joi.string().required()
                            })
                }
            },
            handler: async (request) =>{
               try {
                    const{id} = request.params

                    const result = await this._dataBase.delete(id)

                    if(result.deletedCount === 0){
                        return{
                            message: Boom.preconditionFailed('Id não encontrado'),
                            id:''
                        }
                    }
                    return {
                        message:'Dados Excluidos com sucesso!',
                        id: id
                    }
               } catch (e) {
                    console.log('Falha ao excluir os dados DELETE', e)
                    return Boom.internal()
               }
            }
        }
    }
}

module.exports = HeroisRoute

