var knex = require('../database/connection');
var User = require('./User')

class PasswordToken{
    async create(email){
        var user = await User.findByEmail(email);
        if(user){
            try {
                var token = Date.now();
                await knex.insert({
                    user_id: user.id,
                    used: 'N',
                    token: token
                }).table('token')
                return { status: true, token: token}
            } catch (error) {
                console.log(error)
                return { status: false, err: error}
            }
            
        }else{
            return { status: false, err: 'usuario email usado n existe no banco de dados'}
        }
    }

    async validate(token){

        try {
            var result = await knex.select().where({token:token}).table('token')
            if(result.length > 0){

                var tk = result[0];
                console.log(tk)
                if(tk.used == 'S'){
                    return {status:false};
                }else{
                    return {status:true, token:tk};
                }
                
            }else{
                return {status:false};
            }
        } catch (error) {
            console.log(error)
            return false
        } 
    }

    async setTokenIsUsed(token){
        try{
            knex.update({used:'S'}).table('token').where({token})
        }catch(err){
            console.log(err)
        }
    }
    
}

module.exports = new PasswordToken();