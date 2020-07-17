const assert = require('assert')
const Context = require('../src/db/strategy/base/ContextStrategy')
const modelMongo = require('../src/db/MongoDb/schemas/schemaMongo')
const modelAuth = require('../src/db/MongoDb/schemas/SchemaAuth')
const mongo = require('../src/db/MongoDb/MongoDb')

const schemaPostgres = require('../src/db/postgres/schemas/schemasPostgres')
const postgres = require('../src/db/postgres/Postgres')

const HEROIS_CREATE = {
    nome:'Willian',
    poder:'Beleza'
}

let DbMongo = {}
let DbPostgres = {}
describe('Testes Banco de Dados', function(){
    this.beforeAll(async()=>{
        //const conn = await mongo.Connect('usuarios')
        const conn = await mongo.Connect()
        const Pconn = await postgres.Connect()
        
        //console.log('CONNECT_MONGO', conn)
        //console.log('CONNECT_POSTGRES', Pconn)

        const modelPostgres = await postgres.defineModel(Pconn, schemaPostgres)
        DbMongo = new Context(new mongo(conn, modelAuth))
        DbPostgres = new Context(new postgres(Pconn, modelPostgres))
        
        //await DbMongo.create(HEROIS_CREATE)
        await DbPostgres.create(HEROIS_CREATE)
    })
    
    it('IsConnect, Postgres', async ()=>{
        const result = await DbPostgres.isConnect()
        console.log('Result', result)
        assert.ok(result, true)
    })
    
    // it('IsConnect, MongoDb', async()=>{
    //     const result = await DbMongo.isConnect()
        
    //     assert.deepEqual(result, 'connected')
    // })

    it('INSERT, Postgres', async ()=>{
        const {dataValues:{nome, poder}} = await DbPostgres.create(HEROIS_CREATE)
        assert.deepEqual({nome, poder}, HEROIS_CREATE)
    })

    // it('INSERT, mongoDb', async ()=>{
    //     const result = await DbMongo.create(HEROIS_CREATE)
    //     assert.ok(result)
    // })

    it('LISTER, Postgres', async()=>{
        //console.log('HEROIS_CREATE', HEROIS_CREATE)
        const[dados] = await DbPostgres.search(HEROIS_CREATE.nome)
        
        delete dados.id
        assert.deepEqual(dados, HEROIS_CREATE)
        //console.log('return', dataValues)
    })

    // it('LISTER, MongoDb', async ()=>{
    //     const [result] = await DbMongo.search(HEROIS_CREATE.nome)
    //     const obj = {
    //         nome: result.nome,
    //         poder: result.poder
    //     }
    //     //delete result.id
    //     assert.deepEqual(obj , HEROIS_CREATE)
    // })

    it('UPDATE, Postgres', async()=>{
        const [returnId] = await DbPostgres.search(HEROIS_CREATE.nome)
        //console.log('Dados', returnId)
        const obj = {
            nome:"Super-Man",
            poder:"Força"
        }
        const result = await DbPostgres.update(returnId.id, obj)
        assert.ok(result, 1)
        
    })

    // it('UPDATE, MongoDb', async()=>{
    //     const [returnId] = await DbMongo.search(HEROIS_CREATE.nome)
    //     //console.log('return', returnId)
    //     const obj = {
    //         nome:"Willian Carlos",
    //         poder:"Inteligencia"
    //     }

    //     const result = await DbMongo.update(returnId._id, obj)
    //     assert.ok(result.nModified, 1)
    // })

    it('DELETE, Postgres', async ()=>{
        const [returnId] = await DbPostgres.search(HEROIS_CREATE.nome)

        const result = await DbPostgres.delete(returnId.id)

        assert.ok(result, 1)
    })

    // it('DELETE, MongoDb', async ()=>{
    //     const [returnId] = await DbMongo.search(HEROIS_CREATE.nome)

    //     const result = await DbMongo.delete(returnId)

    //     assert.ok(result.deletedCount, 1)
    // })

    // it('SIGN IN MongoDb', async ()=>{
    //     const obj = {
    //         email : 'willian@willian.com',
    //         password: '12345'
    //     }
    //     const result = await DbMongo.create(obj)
    //     console.log('RESULT', result)
    // })

    // it('Search MongoDb', async ()=>{
    //     const obj = {
    //         email : 'willian@willian.com',
    //         password: '12345'
    //     }
    //     const result = await DbMongo.searchUser(obj.email)
    //     console.log('RESULT', result)
    // }) 
})