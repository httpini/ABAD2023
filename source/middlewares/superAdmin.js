const isAdmin = (req,res,next) => {
    if(req.session.user.permiso != "sAdmin"){
      return res.redirect('/usuarios/login')
    }
    return next()
  }
  module.exports = isAdmin