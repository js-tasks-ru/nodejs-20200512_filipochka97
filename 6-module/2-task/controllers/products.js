const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.request.query.subcategory;
  let products;

  if (!subcategory) {
    products = await Product.find({});
  } else {
    products = await Product.find({subcategory});
  }

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {};
};

module.exports.productById = async function productById(ctx, next) {
  const {id: paramId} = ctx.params;

  if (!mongoose.isValidObjectId(paramId)) {
    ctx.throw(400);
  }

  const product = await Product.findById(paramId);

  if (!product) {
    return ctx.throw(404);
  }

  ctx.body = {product};
};

