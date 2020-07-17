
const {config} = require('dotenv')
const {join} = require('path')
const {ok} = require('assert')

const env = process.env.NODE_ENV || 'dev'

ok(env === 'prod' || env === 'dev' , 'Parametro env inválido')

const configPath = join(__dirname, './config', `.env.${env}`)

console.log('Arquives Config', configPath)

config({
    path: configPath
})

const Hapi = require('@hapi/hapi')
const HapiSwagger = require('hapi-swagger')
const Hapijwt = require('hapi-auth-jwt2')
//const HapijwtConfig = require('./config/jsonwebtoken');
const Inert = require('inert')
const Vision = require('vision')

const Context = require('./src/db/strategy/base/ContextStrategy')

const MongoDb = require('./src/db/MongoDb/MongoDb')
const Postgres = require('./src/db/postgres/Postgres')

const schemaP = require('./src/db/postgres/schemas/schemasPostgres')
const schemaM = require('./src/db/MongoDb/schemas/schemaMongo')
const schemaAuth = require('./src/db/MongoDb/schemas/SchemaAuth')

const routeHero = require('./src/Routes/HeroisRoute')
const routeAuth = require('./src/Routes/AuthRoutes')

const KEY = 'my_password_secret'

function mapMethods(instance, methods) {
   
    return methods.map(metodo=>instance[metodo]())
}

const init = async ()=>{
    
    const connPostgres = await Postgres.Connect()
    
    const modelP = await Postgres.defineModel(connPostgres, schemaP)

    const DbPostgres = new Context( new Postgres(connPostgres, modelP))

    const connMongodb = await MongoDb.Connect('usuarios')
    
    const DbMongo = new Context(new MongoDb(connMongodb, schemaAuth))
   
    const Server = Hapi.Server({
        port: process.env.PORT || 6000    
    })

    const Swagger = {
        info:{
            title: 'Api de Herois',
            version: 'v2.0'
        }
    }

    await Server.register([
        Hapijwt,
        Inert,
        Vision,
        {
            
            plugin: HapiSwagger,
            options:Swagger
            
        }
    ])

    Server.auth.strategy(
        'jwt',
        'jwt',
        {
          key: KEY,
          validate: async (dados, request)=>{
            //console.log('REQUEST', dados)
             const result = await DbMongo.searchLogin({
                email : dados.email,
                _id : dados._id
             })
            //console.log('RESULT', result)
            if(!result)return{isValid : false}

            return{
                 isValid : true
            }
          }  
        }
    )
    
    Server.auth.default('jwt')

    await Server.start();

    Server.route([
        ...mapMethods(new routeHero(DbPostgres), routeHero.methods()),
        ...mapMethods(new routeAuth(DbMongo, KEY), routeAuth.methods())
    ])
    
    console.log('Servidor está em execução', Server.info)

    return Server
  
}

process.on('unhandledRejeiction', (error)=>{
    console.log('Error', error)
    process.exit(1)
})

module.exports = init()
