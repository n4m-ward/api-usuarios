var User = require('../models/User');
const { use } = require('../routes/routes');
var PasswordToken = require('../models/PasswordToken')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');

var secret = "30182309182-38jdajsdaljdçldlçasdmaklsdma"

class UserController{

    async index(req,res){
        var users = await User.findAll()
        res.json(users)
    }

    async findUser(req,res){
        var id = req.params.id;
        
        var user = await User.findById(id);

        if(user == undefined){
            res.status(404)
            res.json({err:'usuario não encontrado'})
        }else{
            res.status(200)
            res.json(user)
        }
    }

    async create(req,res){
        
        var {email, name, password} = req.body;

        if(email == undefined){
            res.status(400);
            res.json({err:'o e-mail é invalido!'})
            return;
        }

        var emailExist = await User.findEmail(email)

        if(emailExist){
            res.status(406);
            res.json({err: 'o e-mail ja esta cadastrado!'})
            return;
        }else{
            await User.new(email,password,name)
        }
        
        res.send('tudo ok')
        res.status(200);
    }

    
    async edit(req,res){
        var {id,name,role,email} = req.body;
        var result = await User.update(id,email,name,role)

        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send('Tudo Ok!')
            }else{
                res.status(406)
                res.send(result.err)
            }
        }else{
            res.status(406);
            res.send('Ocorreu um erro no servidor!');
        }
    }

    async delete(req,res){
        var {id} = req.params;
    
        var result = await User.delete(id);

        if(result.status){
            res.status(200)
            res.send("Tudo Ok")
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async recoverPassword(req,res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        if (result.status) {
            res.status(200)
            res.json(result.token)
        } else {
            res.status(406)
            res.send(result.err)
        }
    }

    async changePassword(req,res){
        var {token, password} = req.body;

        var isValidToken = await PasswordToken.validate(token);
        console.log(isValidToken)
        if(isValidToken.status){
            await User.changePassword(password, isValidToken.token.user_id,isValidToken.token.token)
            await PasswordToken.setTokenIsUsed(token)
            res.status(200);
            res.send('senha alterada')
        }else{
            res.status(406)
            res.send('Token invalido')
        }
    }

    async login(req,res){
        var {email,password} = req.body;
        var user = await User.findByEmail(email)
        user.password = user.password.toString()
        console.log(user.password)
        if(user){
            var resultado = await bcrypt.compare(password,user.password)

            if(resultado){
                var token = jwt.sign({ email:user.email, role: user.role }, secret);
                res.status(200);
                res.json({token})
            }else{
                res.status(406)
                res.send("Senha incorreta")
            }

            res.json({status: resultado})
        }else{
            res.json({status: false})
        }
    }
}

module.exports = new UserController();