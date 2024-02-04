// passport.js
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';


let cookieExtractor = function(req) {
    console.log("I am executed cookie extractor")
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

const options = {
    jwtFromRequest: cookieExtractor,
  secretOrKey: 'your-secret-key', // Replace with your own secret key
};

passport.use(
  new Strategy(options, async (payload, done) => {
    try {
        console.log("Payload",payload);

      const user = await User.findById(payload.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;


//implement jwt Oauth