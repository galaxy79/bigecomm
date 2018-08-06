const mongoose = require('mongoose');
const validator = require('validator');
var Schema = mongoose.Schema;
let productSchema = new Schema({
  productcategory: {
    type: String,
    required: true,
    validate: {
      validator(productcategory) {
        return validator.isAlpha(productcategory, 'en-IN');
      }
    }
  },
  producttitle: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(producttitle) {
        return validator.isAlpha(producttitle, 'en-IN');
      }
    }
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(sku) {
        return validator.isAlphanumeric(sku);
      }
    }
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
        return validator.isAlphanumeric(productseller);
      }
    }
  },
  productquantity: {
    type: String,
    required: true,
    validate: {
      validator(productquantity) {
        return validator.isInt(productquantity, { min: 0, max: 99 });
      }
    }
  },
  productdescription: [{
    feature: {
      type: String,
      required: true,
      validate:
        {
          validator(feature) {
            return validator.isAlphanumeric(feature);
          }
        }
    }
  }],
  productimages: [{
    imagepath: {
      type: String, required: false, trim: true, validate:
        {
          validator(imagepath) {
            return validator.isURL(imagepath, { allow_protocol_relative_urls: false });
          }
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
            }
          }
      },
    saleprice: {
      type: String, required: true, trim: true, validate:
        {
          validator(saleprice) {
            return validator.isNumeric(saleprice);
          }
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
  review:
  [
    {
      title: {
        type: String,
        required: false,
        validate:
          {
            validator(title) {
              return validator.isAlphanumeric(title);
            }
          }
      },
      ratingstars: {
        type: String,
        required: false,
        validate:
          {
            validator(ratingstars) {
              return validator.isNumeric(ratingstars);
            }
          }
      },
      comment: {
        type: String,
        required: false,
        validate:
          {
            validator(comment) {
              return validator.isAlphanumeric(comment);
            }
          }
      }

    }
  ]
});

productSchema.pre('save', async function(next) {
  try{
    
    //console.log(procedureName)
    this.price.discountprice = this.price.marketprice - this.price.saleprice
    this.price.discountpercentage = ((this.price.marketprice - this.price.saleprice)/this.price.marketprice) * 100
    next();

  }
  catch(err)
  {
   next(err); 
  }
})
module.exports.product = mongoose.model('product', productSchema);

