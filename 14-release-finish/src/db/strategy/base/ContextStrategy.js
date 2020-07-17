const Crud = require('../interface/InterfaceCrud')

class ContextStrategy extends Crud{
    constructor(db){
        super();
        this._dataBase = db;
    }

    static Connect(){
        return this._dataBase.Connect();
    }

    isConnect(){
        return this._dataBase.isConnect();
    }

    create(item){
        return this._dataBase.create(item)
    }

    search(query, limite, skip){
        return this._dataBase.search(query, limite, skip)
    }
    searchUser(query){
        return this._dataBase.searchUser(query)
    }
    searchLogin(query){
        return this._dataBase.searchLogin(query)
    }
    update(query, item){
        return this._dataBase.update(query, item)
    }

    delete(id){
        return this._dataBase.delete(id)
    }
}

module.exports = ContextStrategy