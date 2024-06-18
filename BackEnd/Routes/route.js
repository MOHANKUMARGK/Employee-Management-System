let express=require('express')
const { adminregisterController } = require('../Controllers/controllers')

let route=express.Router()

route.post('/adminregister',adminregisterController)
module.exports={route}
