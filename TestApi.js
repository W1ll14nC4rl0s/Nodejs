const assert = require('assert')
const api = require('./api')

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndpbGxpYW4iLCJpZCI6MSwiaWF0IjoxNTkzNjMxMjQwfQ.sZHDW9uwBWOq94R1lSz5lSNGGf7QblOK4i336KoAVXs"

const headers = {
    authorization : TOKEN
}

let app = {}

const MOCK_DEFAULT = {
    nome: 'Super-man',
    poder: 'Super Força'
}
describe('Suite de Testes APi', function(){
        this.beforeAll( async ()=>{
           
           app = await api
            
        })
    
      
    it('Teste POST', async ()=>{
       
        const valid = await app.inject({
            method:'POST',
            url:'/herois',
            headers,
            payload: MOCK_DEFAULT
        })
        //console.log('RESULT', valid.payload)
        const{message} = JSON.parse(valid.payload)
        assert.deepEqual(message, 'Dados gravados com Sucesso!')
    })

    it('Teste Get',  async function(){
        this.timeout(8000);
        const NAME = 'Willian'
        const LIMIT = 2
        const SKIP = 2
        const valid = await app.inject({
            method:'GET',
            url:`/herois?nome=${NAME}&limit=${LIMIT}&skip=${SKIP}`,
            headers
        })
        
        const dados = JSON.parse(valid.payload)
        //console.log('dados', dados)
        assert.deepEqual(valid.statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Teste PATCH', async ()=>{
        const searchId = await app.inject({
            method:'GET',
            headers,
            url:`/herois?nome=${MOCK_DEFAULT.nome}`
        })
        
        const [dados] = JSON.parse(searchId.payload)
        const data = new Date()
        const update = {
            nome:'Willian - '+ data.getTime()
        }
        
        const valid = await app.inject({
            method:'PATCH',
            url:`/herois/${dados._id}`,
            headers,
            payload: JSON.stringify(update)
        })
        
        const result = JSON.parse(valid.payload)
        //console.log('result', result)
        assert.deepEqual(valid.statusCode, 200)
        assert.deepEqual(result.message, 'Dados Atualizados com sucesso!')
    })

    it('Teste Delete', async ()=>{
        const NOME= 'Willian -'
        const dadosHeroi = await app.inject({
            method: 'GET',
            url:`/herois?nome=${NOME}`,
            headers
        })
        const[dadosReturn] = JSON.parse(dadosHeroi.payload) 
        //console.log('result', dadosReturn._id)
        const validDelete = await await app.inject({
            method: 'DELETE',
            url:`/herois/${dadosReturn._id}`,
            headers
        })
        const result = JSON.parse(validDelete.payload)
        //console.log('result', result)
        assert.deepEqual(validDelete.statusCode, 200)
        assert.deepEqual(result.message, 'Dados Excluidos com sucesso!')
    })
       
})
