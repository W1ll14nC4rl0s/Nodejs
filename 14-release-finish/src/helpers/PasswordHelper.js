const Bcrypt = require('bcrypt')

const{promisify} = require('util')

const HashAsync = promisify(Bcrypt.hash)
const CompareAsync = promisify(Bcrypt.compare)
const SALT = parseInt(process.env.SALT_PWD)

class PasswordHelper {
    
    static hashPassword(Password){
        //console.log('PASSWORD', Password)
        return HashAsync(Password, SALT)
    
    }

    static ComparePassword(Password, hash){
        return CompareAsync(Password, hash)
    }
}

module.exports =  PasswordHelper