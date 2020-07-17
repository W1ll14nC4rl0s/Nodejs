const Assert = require('assert')

const api = require('../Api')

const HEROI_POST={
    nome:'Rambo',
    poder:'Coragem'
}


let app = {}

let headers = {
    authorization : ''
}
describe('Suite de Testes API', function() {
    this.beforeAll(async()=>{
        app = await api;

        const KEY = await app.inject({
            method: 'POST',
            url:'/login',
            payload:{
                email:'willian@carlos.com',
                password: "12345"
            }
        })
        token = JSON.parse(KEY.payload)
        headers.authorization = token.token

    })

    it('Teste method GET', async()=>{
        const NOME = 'Super-Man'
        const LIMIT = 10
        const SKIP = 1
        const result = await app.inject({
            method: 'GET',
            url:`/herois?nome=${NOME}&limit=${LIMIT}&skip=${SKIP}`,
            headers
        })
        const validDate = JSON.parse(result.payload)
        //console.log('RESULT', result.payload)
        Assert.deepEqual(result.statusCode, 200)
        Assert.ok(Array.isArray(validDate))
        
    })

    it('Teste method POST', async()=>{
        
        const result = await app.inject({
            method: 'POST',
            headers,
            url:'/herois',
            payload: HEROI_POST
            
        })
        const {message} = JSON.parse(result.payload) 
        Assert.deepEqual(result.statusCode, 200)
        Assert.deepEqual(message, 'Dados gravados com Sucesso!')
       
    })

    it('Teste method PATCH', async ()=>{
        const obs = {
            ...HEROI_POST,
            poder:'Força'
        }
        const getId = await app.inject({
            method: 'GET',
            headers,
            url:`/herois?nome=${HEROI_POST.nome}`,
        })

        const [valid] = JSON.parse([getId.payload])
        //console.log('TIPO',  typeof valid.id)
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url:`/herois/${valid.id}`,
            payload: JSON.stringify(obs)
        })

        const validate = JSON.parse(result.payload)

        Assert.deepEqual(validate.message, 'Dados atualizados com sucesso')
        Assert.notDeepEqual(validate.nModified, 0)
    })

    it('Teste DELETE', async ()=>{
        const dadosId = await app.inject({
            method: 'GET',
            headers,
            url:`/herois?nome=${HEROI_POST.nome}`
        })
        
        const [valid] = JSON.parse(dadosId.payload)

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url:`/herois/${valid.id}`
        })

        Assert.deepEqual(result.payload, 1)
    })
})


