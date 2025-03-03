exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.postgresErrorHandler = (err, req, res, next) => {
  if (err.code === "42P18" || err.code === "22P02" || err.code === "23502" || err.code === "2201W" || err.code === "42703"|| err.code === "2201X") {
    res.status(400).send({ msg: "Bad Request" });
  }else if(err.code === "23503"){
    res.status(404).send({ msg: "Does Not Found" });

  } else next(err);
};
