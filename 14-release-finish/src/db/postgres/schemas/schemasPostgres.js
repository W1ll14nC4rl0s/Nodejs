const Sequelize = require('sequelize')

const model = {
    nome:'ModelTableHerois',
    schema:{
        id:{
            type:Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome:{
            type:Sequelize.STRING,
            required: true
        },
        poder:{
            type:Sequelize.STRING,
            required:true
        }
    },
    options:{
        tableName:'TB_HEROIS',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = model