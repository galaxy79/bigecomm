const mongoose = require('mongoose');
const validator = require('validator');
const autoIncrement = require('mongoose-plugin-autoinc');
var Schema = mongoose.Schema;
let productSchema = new Schema({
  productcategory: {
    type: String,
    required: true,
    validate: {
      validator(productcategory) {
        return validator.isAlpha(validator.blacklist(productcategory, ' '), 'en-IN');
      },message:'Product Category should contain only characters'
    }
  },
  department: {
    type: String,
    required: true,
    enum: ['Women', 'Men', 'Girl','Boy']
    
  },
  producttitle: {
    type: String,
    required: true,
    
    validate: {
      validator(producttitle) {
        return validator.isAlpha(validator.blacklist(producttitle, ' '), 'en-IN');
      },message:'Product title should be alphanumeric'
    }
  },
  amazonsku:{
    type: String,
    validate: {
      validator(sku) {
        return validator.isAlphanumeric(validator.blacklist(sku, '-'));
      },message:'SKU  should be alphanumeric'
    }
  },

  sku: {
    type: String,
    required: false,
   unique: true
    // validate: {
    //   validator(sku) {
    //     return validator.isAlphanumeric(sku);
    //   },message:'SKU  should be alphanumeric'
    // }
  },

  dateavailable: {
    type: Date,
    required: true,
    default: Date.now
  }
,
  productseller: {
    type: String,
    required: true,
    validate: {
      validator(productseller) {
        return validator.isAlphanumeric(validator.blacklist(productseller, ' '));
      },message:'Review title should be alphanumeric'
    }
  },
  productquantity: {
    type: String,
    required: true,
    validate: {
      validator(productquantity) {
        return validator.isInt(productquantity, { min: 1, max: 99 });
      },message:'Product quantity should be numeric'
    }
  },
  productdescription: [
    
    {
      _id: false,
    feature: {
      type: String,
      required: true,
      
    }
  }],
  productimages: [
    {
      _id: false,
    imagepath: {
      type: String, required: false, trim: true, validate:
        {
          validator(imagepath) {
            return validator.isURL(imagepath, { allow_protocol_relative_urls: true });
          },message:'Image path should be full url'
        }
    }
  }],
  price:
  {
    marketprice:
      {
        type: String, required: true, trim: true, validate:
          {
            validator(marketprice) {
              return validator.isNumeric(marketprice);
            },message:'market price should be in numeric'
          }
      },
    saleprice: {
      type: String, required: true, trim: true, validate:
        {
          validator(saleprice) {
            return validator.isNumeric(saleprice);
          },message:'Sale price should be numeric'
        }
    },
    discountprice: {
      type: String, required: false, trim: true, validate:
        {
          validator(discount) {
            return validator.isNumeric(discount);
          }
        }
    },
    discountpercentage: {
      type: String, required: false, trim: true, validate:
        {
          validator(discount) {
            return validator.isNumeric(discount);
          }
        }
    }
  },
  sizemap:
  [
    
    {
      _id: false,
       size :
      {
        type: String,
        required: true
      }
  }
  ],
  colormap:
  [
    
    {
      _id: false,
      color :
      {
        type: String,
        required: true
      }
  }
  ],
  review:
  [
   
    {
      _id: false,
      title: {
        type: String,
        required: false,
        validate:
          {
            validator(title) {
              return validator.isAlphanumeric(validator.blacklist(title, ' '));
            },message:'Review title should be alphanumeric'
          }
      },
      ratingstars: {
        type: String,
        required: false,
        validate:
          {
            validator(ratingstars) {
              return validator.isNumeric(ratingstars);
            },message:'Review rating should be numeric'
          }
      },
      comment: {
        type: String,
        required: false,
        validate:
          {
            validator(comment) {
              return validator.isAlphanumeric(validator.blacklist(comment, ' '));
            },message:'Review comment should be alphanumeric'
          }
      }

    }
  ]
});

productSchema.pre('save', async function(next) {
  var date = new Date();
  var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    
  ];
  try{
    
    //console.log(procedureName)
    this.price.discountprice = this.price.marketprice - this.price.saleprice
    this.price.discountpercentage = (((this.price.marketprice - this.price.saleprice)/this.price.marketprice) * 100).toFixed(2)
    this.sku=components.join("");
    next();

  }
  catch(err)
  {
   next(err); 
  }
})
module.exports = mongoose.model('product', productSchema);

