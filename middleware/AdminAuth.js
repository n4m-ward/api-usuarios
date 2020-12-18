var jwt = require('jsonwebtoken')
var secret = "30182309182-38jdajsdaljdçldlçasdmaklsdma"

module.exports = function(req,res,next){
    const authToken = req.headers['authorization']

    if(authToken){
        const bearer = authToken.split(' ')
        var token = bearer[1]

        try {
            var decoded = jwt.verify(token,secret)

            if(decoded.role == 1){
                next()
            }else{
                res.status(403);
                res.send("Você não tem permissão para acessar essa rota!")
            return;
            }
            
            next()
        } catch (error) {
            res.status(403);
            res.send("Usuario não autenticado")
            return;
        }

        
        
    }else{
        res.status(403)
        res.send('Usuario não autenticado')
        return;
    }
}