const mongoose = require('mongoose');
const validator = require('validator');
const ProductModel = require('./model/product.js');


const mongoString = 'mongodb://ekatva:Otpgms2018@localhost:27017/ekatva';
//'mongodb://' + uid + ':' + paswd + '@' + dbhost + ':' + dbport + '/' + dbname;
const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect id',
});

const dbExecute = (db, fn) => db.then(fn).finally(() => db.close());

function dbConnectAndExecute(dbUrl, fn) {
  return dbExecute(mongoose.connect(dbUrl, { useMongoClient: true }), fn);
}

module.exports.getproductsbasedoncategory = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.productcategory)) {
    callback(null, createErrorResponse(400, 'Incorrect product category'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    ProductModel
      .find({ productcategory: event.pathParameters.productcategory })
      .then(user => callback(null, { statusCode: 200, body: JSON.stringify(user) }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};


module.exports.createProduct = (event, context, callback) => {
  console.log("hello")
  console.log(event.body)
  //console.log(JSON.parse(event.body))
  const product = event.body;

  // const product = new ProductModel({
  //   productcategory: data.name,
  //   firstname: data.firstname,
  //   birth: data.birth,
  //   city: data.city,
  //   ip: event.requestContext.identity.sourceIp,
  // });

  // if (product.validateSync()) {
  //   callback(null, createErrorResponse(400, 'Incorrect product data'));
  //   return;
  // }

  dbConnectAndExecute(mongoString, () => (
    product
      .save()
      .then(() => callback(null, {
        statusCode: 201,
        body: JSON.stringify({ id: product.id }),
      }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};

module.exports.deleteUser = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    ProductModel
      .remove({ _id: event.pathParameters.id })
      .then(() => callback(null, { statusCode: 200, body: JSON.stringify('Ok') }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};

module.exports.updateUser = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const id = event.pathParameters.id;

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  const user = new ProductModel({
    _id: id,
    name: data.name,
    firstname: data.firstname,
    birth: data.birth,
    city: data.city,
    ip: event.requestContext.identity.sourceIp,
  });

  if (user.validateSync()) {
    callback(null, createErrorResponse(400, 'Incorrect parameter'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    ProductModel.findByIdAndUpdate(id, user)
      .then(() => callback(null, { statusCode: 201, body: JSON.stringify('Ok') }))
      .catch(err => callback(err, createErrorResponse(err.statusCode, err.message)))
  ));
};
