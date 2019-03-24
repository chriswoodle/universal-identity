import * as express from 'express';
import * as joi from 'joi';

import * as utils from '../utils';
import * as api from '../api';
import * as types from '../types';

import * as connector from '../connector';
import { DB } from '../database';
import { ObjectId } from 'bson';

const log = require('debug')('app:model-a');

export const client = express.Router();
client
    .use(utils.auth(types.TokenType.Client))
    .get('/resource/:keyId', retrieveResource)

function retrieveResource(req: express.Request, res: express.Response) {
    const account = req.account!;
    log(account._id);
    const keyId = req.params['keyId'];
    api.retrieveAndExecuteSession(keyId).then(sessionId=> {
        DB.getSession({ _id: sessionId }).then(record => {
            if (!record) return res.status(404).json({
                status: 'error',
                message: 'Could not find session',
            });
            res.send({
                session: record,
                results: connector.getSessionResults(sessionId)
            });
        });
    }).catch(error => {
        return res.status(400).json({
            status: 'error',
            message: error
        });
    })
}


export const user = express.Router();
user
    .use(utils.auth(types.TokenType.User))
    .post('/key', createKey)

function createKey(req: express.Request, res: express.Response) {
    const account = req.account!;
    log(account._id);
    const data = req.body;
    const schema = joi.object().keys({
        types: joi.array().items(joi.string()).required(),
        key: joi.string()
    });
    const result = joi.validate<types.SessionParams>(data, schema);
    if (result.error)
        return res.status(400).json({
            status: 'error',
            message: 'Invalid request data',
            data: data
        });
    api.createSession(account._id, result.value.types, result.value.key).then(record => {
        res.send(record);
    })

}
