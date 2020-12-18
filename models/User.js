var knex = require('../database/connection')
var bcrypt = require('bcrypt');
const { where } = require('../database/connection');

class User {

    async findAll(){
        try {
            var result = await knex.column('id','name','email','role').table("users")
            
            if(result.length >0){
                return result;
            }else{
                return undefined;
            }
        } catch (error) {
            return undefined;    
        }
    }

    async findById(id){
        try {
            var result = await knex.select('id','name','email','role').where({id: id}).table("users")
            return result[0];
        } catch (error) {
            return {};    
        }
    }

    async findByEmail(email){
        try {
            var result = await knex.select('id','name','email','password','role').where({email: email}).table("users")
            return result[0];
        } catch (error) {
            return {};    
        }
    }

    async new(email,password,name){
        
        try{
            var hash = await bcrypt.hash(password, 10)
            await knex.insert({email,password: hash,name,role:0}).table('users')
        }catch(err){
            console.log(err)
        }
    }

    async findEmail(email){
        try {
            var result = await knex.select('*').from('users').where({email: email})
            if(result.length >0){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error)
            return false;
        }
        
    }

    async update(id,email,name,role){
        var user = await this.findById(id);

        if(user != undefined){
            var editUser = {};

            if(email != user.email){
                var result = await this.findEmail(email);

                if(!result){
                    editUser.email = email;
                }else{
                    return {status:false,err:'O e-mail já está cadastrado'}
                }
            }

            if(name != undefined){
                editUser.name = name;
            }
            if(role != undefined){
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({id:id}).table('users')
                return{status:true}    
            } catch (error) {
                return {status:false,err: error}
            }
        }else{
            return{status: false,err:'O usuario n existe!'}
        }
    }

    async delete(id){
        var user = await this.findById(id)
        if(user){
            try {
                await knex.delete().where({id:id}).table('users')
                return {status:true}
            } catch (error) {
                return {status: false,err:error}
            }
            
        }else{
            return {status: false,err:'O usuario não existe'}
        }
    }
    async changePassword(newPassword,id,token){
        var hash = await bcrypt.hash(newPassword, 10)
        await knex.update({password: hash}).where({id:id}).table('users')
    }
}

module.exports = new User();