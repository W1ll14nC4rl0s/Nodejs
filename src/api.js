//npm i dotenv
//npm i -g cross-env
//subindo o postgres para o heroku 
//instalar a dependecia do heroku modo global
//npm i -g heroku
//estar fora de todas as pastas e dar um 
//git init para criar um repositorio
//git remote -v apresentar os repositorios remotos
//heroku git:remote --app cursonodebr-willian lincar nosso projeto com o repositorio do heroku
//git status para checar o status do repositorio
//git add . para subir o projeto
//git commit -m "v1" dar um commit na adicção
//git push heroku master para subir vai subir o projeto para o heroku e instalar todas as dependencias do projeto
//heroku logs apresente o log de upload do projeto 
const {config} = require('dotenv')
const {join} = require('path')
const {ok} = require('assert')

const env = process.env.NODE_ENV || 'dev'

ok(env === 'prod' || env === 'dev', 'a env é inválida')

const configPath = join(__dirname, '../config', `.env.${env}`)
console.log('config',configPath)
config({
    path: configPath
})

const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/ContextStrategy')
const mongo = require('./db/mongoDb/MongoDb')
const modelMongo = require('./db/mongoDb/schemas/SchemaMongo')

const SchemaPostgres = require('./db/Postgres/schemas/SchemaUser')
const Postgres = require('./db/Postgres/Postgres')

const Route = require('./routes/heroisRoute')
const AuthRoute = require('./routes/AuthRoutes')
const hapiJwt = require('hapi-auth-jwt2')
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const { Console } = require('console')

const jwt_key = process.env.KEY

console.log('KEY', jwt_key)


const app = new Hapi.Server({
    host:'localhost',
    port: process.env.PORT
})

function mapRoutes(instancia, metodos){
    
    return metodos.map(metodo => instancia[metodo]())
}

async function main(){
    const connect =  mongo.connect()
  
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
            ...mapRoutes(new AuthRoute(jwt_key, dbPostgres), AuthRoute.methods())   
        ])

        console.log('Servidor online', app.info.port)
        
   } catch (e) {
        console.log('Falha ao subir a API', e)
   }

  
  
   return app;
}

module.exports = main()

