const Bcrypt = require('bcrypt')

const {
    promisify
} = require('util')

const hashAsync = promisify(Bcrypt.hash)
const compareAsync = promisify(Bcrypt.compare)
const SALT = parseInt(process.env.SALT_PWD) //determina a complexidade de algoritmo e a quantidade de processamento necessario para realizar suas funções
class PasswordHelper{

    static hashPassword(password){
        return hashAsync(password, SALT)
    }

    static comparePassword(password, hash){
        return compareAsync(password, hash)
    }
}

module.exports = PasswordHelper