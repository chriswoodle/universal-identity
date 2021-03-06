import { DB } from './database';
import * as types from './types';
import * as crypto from 'crypto';
import * as connector from './connector';
import { ObjectId } from 'bson';

const log = require('debug')('app:api');

export function createAccount(params: types.AccountParams) {
    const { username, password, fullName } = params;
    const account: types.Account = {
        username,
        fullName,
        type: types.AccountType.User,
        created: new Date().toISOString(),
        passwordHash: hashPassword(password, username) // Username is salt
    }
    return DB.createAccount(account).then(response => {
        if (response.insertedCount <= 0) {
            log('failed to insert record');
            return Promise.reject('failed to insert record');
        }
        const record: types.AccountRecord = response.ops[0];
        return createToken(record._id);
    })
}

export function login(params: types.LoginParams) {
    const { username, password } = params;
    const accountQuery: Partial<types.AccountRecord> = {
        username,
        passwordHash: hashPassword(password, username)
    }
    return DB.getAccount(accountQuery).then(record => {
        if (!record) {
            log('incorrect credentials');
            return Promise.reject('incorrect credentials');
        }
        return createToken(record._id)
    });
}

export function createSession(clientId: ObjectId, requestedDataTypes: types.DataTypes[], key?: string) {
    const session: types.Session = {
        requestedDataTypes,
        accountId: clientId,
        status: types.SessionStatus.Pending,
        key
    };
    return DB.createSession(session).then(response => {
        if (response.insertedCount <= 0) {
            log('failed to insert record');
            return Promise.reject('failed to insert record');
        }
        const record: types.SessionRecord = response.ops[0];
        return Promise.resolve(record);
    });
}

export function approveSession(sessionId: ObjectId, accountId: ObjectId, waitForComplete?: boolean) {
    log(sessionId)
    return DB.updateSession({ _id: sessionId }, { $set: { status: types.SessionStatus.Approved } }).then(response => {
        if (response.result.n == 0) {
            log('failed to update session');
            return Promise.reject('failed to update session');
        }
        return DB.getSession({ _id: sessionId })
    }).then(record => {
        // Start async process
        if (waitForComplete) return connector.processData(sessionId, accountId, record!.requestedDataTypes).then(() => Promise.resolve(sessionId))
        else connector.processData(sessionId, accountId, record!.requestedDataTypes);
        return Promise.resolve(sessionId);
    });
}

export function rejectSession(sessionId: ObjectId) {
    return DB.updateSession({ _id: sessionId }, { $set: { status: types.SessionStatus.Rejected } }).then(response => {
        if (response.result.n == 0) {
            log('failed to update session');
            return Promise.reject('failed to update session');
        }
        return Promise.resolve(sessionId);
    });
}

export function retrieveAndExecuteSession(keyId: string) {
    return DB.getSession({ key: keyId }).then(record => {
        if (!record) return Promise.reject('could not find key');
        return approveSession(record._id, record.accountId!, true);
    })
}

// Aux functions
function hashPassword(password: string, salt: string) {
    // Password-Based Key Derivation Function 2
    // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
    return crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512').toString('hex');
}

function createToken(accountId: ObjectId) {
    const token: types.Token = {
        _id: crypto.randomBytes(128).toString('hex'),
        accountId,
        type: types.TokenType.User,
        created: new Date().toISOString()
    }
    return DB.createToken(token).then(response => {
        if (response.insertedCount <= 0) {
            log('failed to insert record');
            // Should retry to create account token (if there is a collision)
            return Promise.reject('failed to insert record');
        }
        const record: types.Token = response.ops[0];
        return Promise.resolve(record._id);
    });
}