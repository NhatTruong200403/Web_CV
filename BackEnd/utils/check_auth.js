let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
const key = require('../config');
let userController = require('../controllers/users');
const e = require('express');
const { sendError } = require('./responseHandler');
module.exports = {
    Authentication: async function (req, res, next) {
        if (req.headers && req.headers.authorization) {
            let authorization = req.headers.authorization;
            const expireTime = Date.now() + 24 * 60 * 60 * 1000;
            if (authorization.startsWith("Bearer")) {
                let token = authorization.split(" ")[1]
                let result = jwt.verify(token, key.SECRET_KEY, expireTime);
                if (result.expire > Date.now()) {
                    let user = await userController.GetUserByID(result.id);
                    req.user = user;
                    next();
                } else {
                    return sendError(res, "Token het han", "SERVER_ERROR", 500);
                }
            } else {
                return sendError(res, "Token khong hop le", "SERVER_ERROR", 500);
            }
        } else {
            return sendError(res, "Token khong ton tai", "SERVER_ERROR", 500);
        }
    },
    Authorizetion: function (roles) {
        return async function (req, res, next) {
            try {
                let roleOfUser = req.user.role.name;
                if (roles.includes(roleOfUser)) {
                    next();
                } else {
                    return sendError(res, "Ban khong co quyen", "SERVER_ERROR", 500);
                }
            } catch (error) {
                next(error)
            }
        }
    }
}