const {usuario} = require('../database/models/index');

const recordame = async (req,res,next) => {
    if(req.cookies.recordame != undefined && req.session.user == undefined){
        
        let users = await usuario.findAll()
        req.session.user = users.find(u => u.user_name === req.cookies.recordame)
    }
    next()
 }

 module.exports = recordame