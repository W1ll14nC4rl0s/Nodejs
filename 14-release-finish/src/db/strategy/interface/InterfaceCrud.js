class NotImplemented extends Error{
    constructor(){
        super('Exception module not implemented')
    }
}

class Crud extends NotImplemented{

    static Connect(){
        throw new NotImplemented()
    }

    isConnect(){
        throw new NotImplemented()
    }

    create(item){
        throw new NotImplemented();
    }

    search(query, limit, skip){
        throw new NotImplemented();
    }

    searchUser(query){
        throw new NotImplemented();
    }

    searchLogin(query){
        throw new NotImplemented();
    }

    update(query, item){
        throw new NotImplemented();
    }

    delete(id){
        throw new NotImplemented();
    }
}

module.exports = Crud;