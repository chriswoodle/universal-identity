

import { MongoClient, Db, ObjectId } from 'mongodb';

import * as types from './types';

const log = require('debug')('app:database');

enum Collections {
    Accounts = 'accounts',
    Tokens = 'tokens'
}

class Database {
    private db!: Db
    constructor(connectionString: string) {
        MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
            if (err) throw new Error(err.message);
            this.db = client.db();
            this.db.createIndex(Collections.Accounts, 'username', { unique: true }, () => log('index created')); // Ensure that usernames are unique
        });
    }

    public createAccount(account: types.Account) {
        return this.db.collection<types.Account>(Collections.Accounts).insertOne(account);
    }

    public getAccount(query: Partial<types.Account>) {
        return this.db.collection<types.AccountRecord>(Collections.Accounts).findOne(query);
    }

    public createToken(token: types.Token) {
        return this.db.collection<types.Token>(Collections.Tokens).insertOne(token);
    }

} 

const connection_string = process.env.MONGODB_CONNECTION_STRING;
if(!connection_string) throw new Error('Missing process.env.MONGODB_CONNECTION_STRING!');
export const DB = new Database(connection_string);