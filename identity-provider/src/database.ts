

import { MongoClient, Db, ObjectId } from 'mongodb';

import * as types from './types';

const log = require('debug')('app:database');

enum Collections {
    Accounts = 'accounts',
    Tokens = 'tokens',
    Clients = 'clients',
    Sessions = 'sessions'
}

class Database {
    private db!: Db
    constructor(connectionString: string) {
        MongoClient.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
            if (err) throw new Error(err.message);
            this.db = client.db();
            this.db.createIndex(Collections.Accounts, 'username', { unique: true }, () => log('index created')); // Ensure that usernames are unique
            this.db.createIndex(Collections.Clients, 'name', { unique: true }, () => log('index created')); // Ensure that usernames are unique
        });
    }

    public createAccount(account: types.Account) {
        return this.db.collection<types.Account>(Collections.Accounts).insertOne(account);
    }

    public getAccount(query: Partial<types.AccountRecord>) {
        return this.db.collection<types.AccountRecord>(Collections.Accounts).findOne(query);
    }

    public createToken(token: types.Token) {
        return this.db.collection<types.Token>(Collections.Tokens).insertOne(token);
    }

    public getToken(token: string) {
        return this.db.collection<types.Token>(Collections.Tokens).findOne({ _id: token });
    }

    public createSession(session: types.Session) {
        return this.db.collection<types.Session>(Collections.Sessions).insertOne(session);
    }

    public getSession(session: Partial<types.SessionRecord>) {
        return this.db.collection<types.SessionRecord>(Collections.Sessions).findOne(session);
    }

    public updateSession() {

    }
}

const connection_string = process.env.MONGODB_CONNECTION_STRING;
if (!connection_string) throw new Error('Missing process.env.MONGODB_CONNECTION_STRING!');
export const DB = new Database(connection_string);