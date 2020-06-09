const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const existingUser = await User.findOne({email});

      if (!existingUser) {
        done(null, false, 'Нет такого пользователя');
        return;
      }

      const user = new User(existingUser);
      isPasswordCorrect = await user.checkPassword(password);

      if (!isPasswordCorrect) {
        done(null, false, 'Неверный пароль');
        return;
      }

      done(null, existingUser);
    }
);
