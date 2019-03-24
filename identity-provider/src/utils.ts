import * as express from 'express';

import * as types from './types';
import { DB } from './database';

const log = require('debug')('app:utils');

// token type auth middleware generator
export const auth = function (tokenType: types.TokenType | types.TokenType[]) {
    const middleware: express.Handler = (req, res, next) => {
        const authorization = req.headers['authorization'];
        if (!authorization)
            return Promise.reject({ code: 401, message: 'not authenticated' });
        DB.getToken(authorization).then(token => {
            if (!token)
                return Promise.reject({ code: 401, message: 'token not valid' });
            if (Array.isArray(tokenType)) {
                if (!tokenType.includes(token.type))
                    return Promise.reject({ code: 403, message: 'token not allowed' });
            }
            else
                if (token.type !== tokenType) {
                    return Promise.reject({ code: 403, message: 'token not allowed' });
                }
            return DB.getAccount({ _id: token.accountId });
        }).then(account => {
            if (!account) return Promise.reject({ code: 500, message: 'could not find token accountId' });
            // Attach account to request object for later use
            req.account = account;
            return Promise.resolve();
        }).then(()=>{
            next();
        })
        .catch(error => {
            return res.status(error.code || 500).json({ message: error.message || '' });
        })
    }
    return middleware;
}