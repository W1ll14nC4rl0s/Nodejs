const sequelize = require('sequelize')
const Boom = require('boom')
const Crud = require('./../strategies/interface/interfaceCrud');

class Postgres extends Crud{
    
    constructor(conn, schema){
        super();
        this._connect = conn;
        this._model = schema;
    }

    static async defineMode(conn, schema){
        const model = conn.define(
            schema.nome,
            schema.schema,
            schema.options

        )
        await model.sync()

        return model;
    }

    static connect(){
        return new sequelize(
            process.env.POSTGRES_URL,
                {
                    //host: 'localhost',
                    //dialect: 'postgres',
                    quoteIdentifiers: false,
                    operatorsAliases: 0,
                    logging: false,
                    ssl: process.env.SSL_DB,
                    dialectOptions:{
                        ssl: process.env.SSL_DB
                    }
                }
            )
        //console.log('CONNECTION', conn)
    }

    async isConnect(){
        try {
            await this._connect.authenticate()
            return 1
        } catch (e) {
            console.log('Error ao validar a conexão', e)
            return Boom.internal()
        }
    }

    create(item){
       
        const dataValues = this._model.create(item);
       
        return dataValues
    }

    read(query = {}){
      
     
            
        return this._model.findAll({where: query, raw: true});
       
        //return this._model.findAll({where: {query} , raw: true})
        
    }

    update(id, item, upsert = false){
        
        const fn = upsert ? 'upsert' : 'update'
     
        return this._model[fn](item, {where:{id}})
    }

    async delete(id){
        const query = id ? {id} : {}
        return await this._model.destroy({where:query})
    }
}

module.exports = Postgres