const sequelize = require('sequelize')

const model = {
    nome:'modelHeroes',
    schema:{
        id:{
            type: sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome:{
            type: sequelize.STRING,
            required: true
        },
        poder:{
            type: sequelize.STRING,
            required: true
        }
    },
    options:{
        tableName: 'TB_HEROIS',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = model