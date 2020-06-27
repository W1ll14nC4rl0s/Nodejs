class notImplemented extends Error{
    constructor(){
        super('Exception module not implemented')
    }
}

class Crud extends notImplemented{
    static connect(){
        throw new notImplemented();
    }

    isConnect(){
        throw new notImplemented();
    }

    create(item){
        throw new notImplemented();
    }
    read(item){
        throw new notImplemented();
    }
    update(id, item){
        throw new notImplemented();
    }
    delete(id){
        throw new notImplemented();
    }
}

module.exports = Crud