const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const order = await Order.create({
    user: ctx.user._id,
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });

  const orderWithProduct = await Order.findById(order._id).populate('product');

  await sendMail({
    template: 'order-confirmation',
    locals: {id: orderWithProduct._id, product: orderWithProduct.product},
    to: 'user@mail.com',
    subject: 'Информация о заказе',
  });

  ctx.status = 200;
  ctx.body = {order: orderWithProduct._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({
    user: ctx.user._id,
  }).populate('product');

  ctx.status = 200;
  ctx.body = {orders};
};
