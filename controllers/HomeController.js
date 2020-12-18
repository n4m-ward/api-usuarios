class HomeController{

    async index(req, res){
        res.send("API Express");
    }

}

module.exports = new HomeController();