import { ObjectId } from 'mongodb';
import * as types from './types';
import { DB } from './database';

const log = require('debug')('app:connector');

export interface SessionCache {
    [key: string]: {
        status: 'pending' | 'complete',
        results: any
    }
}

const resultCache: any = {};

export function getSessionResults(sessionId: ObjectId) {
    const results = resultCache[sessionId.toHexString()];
    if (results && results.status == 'pending') delete resultCache[sessionId.toHexString()];
    return results;
}

export function processData(sessionId: ObjectId, accountId: ObjectId, resourceTypes: types.DataTypes[]) {
    const dispatches = resourceTypes.map(type => {
        switch (type) {
            case types.DataTypes.Age:
                return getAge(accountId);
            case types.DataTypes.Over21:
                return getOver21(accountId);
            case types.DataTypes.SSN:
                return getSSN(accountId);
            default:
                return Promise.resolve({});
        }
    });

    Promise.all(dispatches).then(results => {
        resultCache[sessionId.toHexString()] = results;
        DB.updateSession({ _id: sessionId }, { $set: { status: types.SessionStatus.Complete } }).then(response => {
            if (response.result.n == 0) {
                log('failed to update session');
            }
        });
    });

}

function getAge(accountId: ObjectId) {
    return new Promise<number>((resolve, reject) => {
        resolve(23);
    })
};

function getOver21(accountId: ObjectId) {
    return getAge(accountId).then(age => {
        return age >= 21;
    })
}

function getSSN(accountId: ObjectId) {
    return new Promise<string>((resolve, reject) => {
        resolve('abc123');
    })
}

function createCardPayment(accountId: ObjectId) {

}