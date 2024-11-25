exports.customErrorHandler = (err,req,res,next) =>{
    if(err.status && err.msg){
        res.status(err.status).send({msg:err.msg});
    }else{
        next(err);
    }

}

exports.postgresErrorHandler = (err,req,res,next) => {
    if(err.code === "42P18"){
        res.status(400).send({msg:"Bad Request"})
    }else(
        next(err)
    )
}

