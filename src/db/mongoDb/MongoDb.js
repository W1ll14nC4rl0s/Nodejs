const Crud = require('./../strategies/interface/interfaceCrud')
const mongoose = require('mongoose')
const STATUS = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
}
//ewwkSDxY4OdBtxNS senha
class MongoDb extends Crud{
    
    constructor(conn, schema){
        super();
        this._connecting = conn;
        this._model = schema;

    }

    static async connect(){
        //console.log('MONGODB', process.env.MONGODB_URL)
       // mongoose.connect(process.env.MONGODB_URL,
        await mongoose.connect(process.env.MONGODB_URL,
            {useUnifiedTopology: true, useNewUrlParser: true}, (error)=>{
                if(!error) return;
                console.log('Falha ao conectar', error)
            })
        const conn = mongoose.connection
       
        conn.once('open', ()=>true)
        return conn
    }

    async isConnect(){
        //console.log('conexão', this._connecting.readyState)
        const status = STATUS[this._connecting.readyState]
        
        if(STATUS[this._connecting.readyState] === 'connected') return status;

        if(STATUS[this._connecting.readyState] !== 'connecting') return status;

        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connecting.readyState];
    }

    create(item){
        return this._model.create(item)
    }

    read(nome = {}, limit = 0, skip = 0){
       
        return this._model.find(nome).limit(limit).skip(skip)
    }

    update(id, item){
        
        return this._model.updateOne({_id: id}, {$set:item})
    }

    delete(id){
        return this._model.deleteOne({_id:id})
    }
}

module.exports = MongoDb