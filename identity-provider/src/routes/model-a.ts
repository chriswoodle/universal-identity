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
    .post('/session', createSession)
    .get('/session/:sessionId', utils.validateParamId('sessionId'), querySession)

function createSession(req: express.Request, res: express.Response) {
    const account = req.account!;
    log(account._id);
    const data = req.body;
    const schema = joi.object().keys({
        types: joi.array().items(joi.string()).required()
    });
    const result = joi.validate<types.SessionParams>(data, schema);
    if (result.error)
        return res.status(400).json({
            status: 'error',
            message: 'Invalid request data',
            data: data
        });

    api.createSession(account._id, result.value.types).then(record => {
        utils.audit(account._id.toHexString(), `created session: ${record._id}`);
        res.send(record);
    })
}

function querySession(req: express.Request, res: express.Response) {
    const account = req.account!;
    const sessionId = new ObjectId(req.params['sessionId']);
    utils.audit(account._id.toHexString(), `requested session: ${sessionId}`);
    DB.getSession({ _id: sessionId, accountId: account._id }).then(record => {
        if (!record) return res.status(404).json({
            status: 'error',
            message: 'Could not find session',
        });
        res.send({
            session: record,
            results: connector.getSessionResults(sessionId)
        });
    });
}


export const user = express.Router();
user
    .use(utils.auth(types.TokenType.User))
    .get('/session/:sessionId', utils.validateParamId('sessionId'), sessionInfo)
    .post('/session/:sessionId/approve', utils.validateParamId('sessionId'), approveSession)
    .post('/session/:sessionId/reject', utils.validateParamId('sessionId'), rejectSession)


function sessionInfo(req: express.Request, res: express.Response) {
    const sessionId = new ObjectId(req.params['sessionId']);
    DB.getSession({ _id: sessionId }).then(record => {
        if (!record) return res.status(404).json({
            status: 'error',
            message: 'Could not find session',
        });
        res.send(record);
    });
}

function approveSession(req: express.Request, res: express.Response) {
    const account = req.account!;
    log(account._id);
    const sessionId = new ObjectId(req.params['sessionId']);
    utils.audit(account._id.toHexString(), `approved session: ${sessionId}`);
    api.approveSession(sessionId, account._id).then(() => {
        return res.send({
            message: 'Approved'
        });
    }).catch(error => {
        return res.status(400).json({
            status: 'error',
            data: error
        });
    })
}

function rejectSession(req: express.Request, res: express.Response) {
    const account = req.account!;
    log(account._id);
    const sessionId = new ObjectId(req.params['sessionId']);
    utils.audit(account._id.toHexString(), `rejected session: ${sessionId}`);
    api.rejectSession(sessionId).then(() => {
        return res.send({
            message: 'Rejected'
        });
    }).catch(error => {
        return res.status(400).json({
            status: 'error',
            data: error
        });
    })
}




