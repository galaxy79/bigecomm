const mongoose = require('mongoose');
const validator = require('validator');
const prdModel = require('./model/product.js');


//const mongoString = 'mongodb://ekatva:Otpgms2018@localhost:27017/ekatva';
const mongoString=process.env.mongoconnection
//'mongodb://' + uid + ':' + paswd + '@' + dbhost + ':' + dbport + '/' + dbname;
const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: {
    'Content-Type': 'text/plain'
  },
  body: message || 'Incorrect id',
});

async function dbConnect(mongoString) {

  var options = {
    native_parser: true,
    poolSize: 1,
  }

  try {

    if (mongoose.connection.readyState === 0) {

      return await mongoose.connect(mongoString)

    };
  } catch (ex) {
    console.log("Error in connecting to database " + ex)
  }
};

module.exports.createProduct = async (event) => {

  var mongoose = await dbConnect(mongoString)

  let respmsg = {
    'statusCode': '',
    'body': {}
  }
  console.log("my event is ", event)
  const productreq = event.body;
  console.log(productreq)
  var productinstance = new prdModel(productreq);
  productinstance.save(function (err, doc) {
    console.log("saving")
    if (err) {
      console.log(err.message)
      respmsg.statusCode = 500
      respmsg.body = JSON.stringify({
        status: err.message
      })
      console.log(respmsg)
      return respmsg
    } else {

      respmsg.statusCode = 201
      respmsg.body = JSON.stringify({
        id: doc.id
      })
      console.log(respmsg)
      return respmsg;
    }

  })

};

module.exports.getProductdetailsbycategory = async (event) => {

  var mongoose = await dbConnect(mongoString)

  let respmsg = {
    'statusCode': '',
    'body': {}
  }
  const queryparam = event.pathParameters;
  console.log(queryparam)
  try {
    var result = await prdModel.aggregate([{
          "$match": {
            "productcategory": queryparam
          }
        },
        {
          "$project": {
            "_id": 0,
          }
        }
      ]

    )
    console.log("my result ", result)
    respmsg.statusCode = 200;
    respmsg.body = JSON.stringify(result);
    return respmsg;
  } catch (error) {
    console.log(error)
    respmsg.statusCode = 500;
    respmsg.body = JSON.stringify({
      message: error
    })
    return respmsg;

  }
};

module.exports.getProductdetailsbydept = async (event) => {

  var mongoose = await dbConnect(mongoString)

  let respmsg = {
    'statusCode': '',
    'body': {}
  }
  const queryparam = event.pathParameters;
  console.log(queryparam)
  try {
    var result = await prdModel.aggregate([{
        "$match": {
          "productcategory": queryparam
        }
      }, {
        "$project": {
          "_id": 0,
        }
      }]

    )
    console.log("my result ", result)
    respmsg.statusCode = 200;
    respmsg.body = JSON.stringify(result);
    return respmsg;
  } catch (error) {
    console.log(error)
    respmsg.statusCode = 500;
    respmsg.body = JSON.stringify({
      message: error
    })
    return respmsg;

  }
};

module.exports.getProductdetailsbysku = async (event) => {

  var mongoose = await dbConnect(mongoString)

  let respmsg = {
    'statusCode': '',
    'body': {}
  }
  const queryparam = event.pathParameters;
  console.log(queryparam)
  try {
    var result = await prdModel.aggregate([{
        "$match": {
          "productcategory": queryparam
        }
      }, {
        "$project": {
          "_id": 0,
        }
      }]

    )
    console.log("my result ", result)
    respmsg.statusCode = 200;
    respmsg.body = JSON.stringify(result);
    return respmsg;
  } catch (error) {
    console.log(error)
    respmsg.statusCode = 500;
    respmsg.body = JSON.stringify({
      message: error
    })
    return respmsg;

  }
};




module.exports.deleteUser = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    ProductModel
    .remove({
      _id: event.pathParameters.id
    })
    .then(() => callback(null, {
      statusCode: 200,
      body: JSON.stringify('Ok')
    }))
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
    .then(() => callback(null, {
      statusCode: 201,
      body: JSON.stringify('Ok')
    }))
    .catch(err => callback(err, createErrorResponse(err.statusCode, err.message)))
  ));
};