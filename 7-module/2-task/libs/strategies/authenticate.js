const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  const existingUser = await User.findOne({email});

  if (existingUser) {
    done(null, existingUser);
    return;
  }

  const user = new User({
    email,
    displayName,
  });

  await user.save((err, newUser) => {
    if (err) {
      done(err, false);
    } else {
      done(null, newUser);
    }
  });
};
