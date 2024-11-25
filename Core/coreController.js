const { getCoreApi } = require("./coreModels")


exports.coreController = (req,res,next) =>{

    getCoreApi().then((result)=>{
        res.status(200).send({ endpoints: result })
    })
    
}