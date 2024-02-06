// passport.js
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import Admin from '../models/admin.js';
import Store from '../models/store.js';

let cookieExtractor = function(req) {
    console.log("I am executed cookie extractor");
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
            console.log("Payload", payload);

            let user = null;

            // Assuming you have a 'role' field in your JWT payload indicating the user type
            switch (payload.role) {
                case 'user':
                    user = await User.findById(payload.id);
                    break;
                case 'admin':
                    user = await Admin.findById(payload.id);
                    break;
                case 'store':
                    user = await Store.findById(payload.id);
                    break;
                default:
                    return done(null, false);
            }

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
// implement role based auth tomorrow