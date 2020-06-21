const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();

  const user = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken,
  });

  await user.setPassword(ctx.request.body.password);
  await user.save();

  await sendMail({
    template: 'confirmation',
    locals: {token: verificationToken},
    to: user.email,
    subject: 'Подтвердите почту',
  });

  ctx.status = 200;
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;

  const existingUser = await User.findOne({verificationToken});

  if (!existingUser) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  existingUser.verificationToken = undefined;
  await existingUser.save();

  const token = await ctx.login(existingUser);

  ctx.status = 200;
  ctx.body = {token};
};
