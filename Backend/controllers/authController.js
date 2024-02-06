// authController.js

import passport from "../middleware/passport.js";

const authController = {
    async authenticate(req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, user) => {
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
    },

    async isAdmin(req, res, next) {
        if (req.user.role !== 'admin') {
            const error = {
                status: 403,
                message: 'Forbidden. Only admins can access this route.',
            };
            return res.status(403).json(error);
        }
        next();
    },

    async isStore(req, res, next) {
        if (req.user.role !== 'store') {
            const error = {
                status: 403,
                message: 'Forbidden. Only stores can access this route.',
            };
            return res.status(403).json(error);
        }
        next();
    },
};

export default authController;
