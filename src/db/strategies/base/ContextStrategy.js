const Crud = require('./../interface/interfaceCrud')

class ContextStrategy extends Crud{
    
    constructor(strategy){
        super();
        this._database = strategy;
    }

    static connect(){
        return this._database.connect();
    }

    isConnect(){
        return this._database.isConnect();
    }
    create(item){
        return this._database.create(item)
    }
    read(item){
        return this._database.read(item)
    }
    update(id, item, upsert){
        return this._database.update(id, item, upsert)
    }
    delete(id){
        return this._database.delete(id)
    }
}

module.exports = ContextStrategy