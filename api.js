
//npm i -g nyc
const {config} = require('dotenv')
const {join} = require('path')
const {ok} = require('assert')

const env = process.env.NODE_ENV || 'dev'

ok(env === 'prod' || env === 'dev', 'a env é inválida')

const configPath = join(__dirname, './config', `.env.${env}`)
console.log('config',configPath)
config({
    path: configPath
})

const Hapi = require('@hapi/hapi')
const Context = require('./src/db/strategies/base/ContextStrategy')
const mongo = require('./src/db/mongoDb/MongoDb')
const modelMongo = require('./src/db/mongoDb/schemas/SchemaMongo')

const SchemaPostgres = require('./src/db/Postgres/schemas/SchemaUser')
const Postgres = require('./src/db/Postgres/Postgres')

const Route = require('./src/routes/heroisRoute')
const AuthRoute = require('./src/routes/AuthRoutes')
const RouteUtil = require('./src/routes/utilRoutes')

const hapiJwt = require('hapi-auth-jwt2')
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const jwt_key = process.env.KEY

const app = new Hapi.Server({
    
    port: process.env.PORT || 80
})

function mapRoutes(instancia, metodos){
    
    return metodos.map(metodo => instancia[metodo]())
}

async function main(){
   
    const connect = await mongo.connect()

    const dbMongo = new Context( new mongo(connect, modelMongo))
    
    const conn = await Postgres.connect()

    const model = await Postgres.defineMode(conn, SchemaPostgres)

    const dbPostgres = new Context(new Postgres(conn, model))

    const Swagger = {
        info:{
            title:'Api Herois - #NodeBr',
            version: 'v1.0'
        }
        //lang: 'pt',

            
    }
    //console.log(dbMongo)
   await app.register([
        hapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options:Swagger
        }
    ])

    app.auth.strategy(
        'jwt',
        'jwt',
        {
            key : jwt_key,
            validate: async (dado, request)=>{
               
                const [result] = await dbPostgres.read({
                            username: dado.username,
                            id: dado.id
                        })
                //console.log('result', result)
                if(!result) return{
                    isValid : false
                }

                return{
                    isValid : true
                }
            }
        }
    )

    app.auth.default('jwt')

   try {
        app.start();

        app.route([
            ...mapRoutes(new Route(dbMongo), Route.methods()),
            ...mapRoutes(new AuthRoute(jwt_key, dbPostgres), AuthRoute.methods()),
            ...mapRoutes(new RouteUtil(), RouteUtil.methods())   
        ])

        console.log('Servidor online', app.info.port)
        
   } catch (e) {
        console.log('Falha ao subir a API', e)
   }

  
  
   return app;
}

module.exports = main()

