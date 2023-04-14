const logged = (req,res,next) => {
    if(req.session && !req.session.user){
      return res.redirect('/usuarios/login')
    }
    return next()
  }
  module.exports = logged