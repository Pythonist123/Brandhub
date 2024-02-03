import passport from "../middleware/passport.js";

const authController = {

    async authenticate(req,res,next){
        console.log("Auth middleware");
        console.log('Request Headers:', req.headers);
console.log('Token:', req.headers.authorization);

        passport.authenticate('jwt', { session: false }, (err, user) => {
            console.log(err);
            console.log(user);
          if (err || !user) {
            const error = {
              status: 401,
              message: 'Unauthorized',
            };
            return res.status(401).json(error);
          }
          req.user = user;
          return next();
        })(req, res, next);
    }
}

    


export default authController;