const endpointsJson = require("../endpoints.json");
exports.coreController = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJson });
};
