const Base = require('./base/BaseRoute')
const{join} = require('path')

class UtilRoutes extends Base{

    constructor(){
        super();
    }

    converage(){
        return{
            path: '/coverage/{param*}', //param* define que pode ou não ser passado um parametro
            method:'GET',
            config:{
                auth:false
            },
            handler:{
                directory:{
                    path: join(__dirname, '../../coverage'),
                    redirectToSlash:true,
                    index: true,
                }
            }
        }
    }

}

module.exports = UtilRoutes
