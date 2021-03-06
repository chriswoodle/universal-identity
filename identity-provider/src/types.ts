import { ObjectId } from 'mongodb';

declare global {
    namespace Express {
        interface Request {
            account?: AccountRecord
        }
    }
}

export interface LoginParams {
    username: string;
    password: string;
}

export interface AccountParams {
    username: string;
    password: string;
    fullName?: string;
}


export enum AccountType {
    User = 'user',
    Client = 'client'
}

export interface Account {
    username: string;
    passwordHash: string;
    fullName?: string;
    type: AccountType;
    created: string;
    age?: number;
}

export interface AccountRecord extends Account {
    _id: ObjectId,
}

export enum TokenType {
    User = 'user',
    Client = 'client',
    ClientDevice = 'client-device'
}

export interface Token {
    _id: string
    accountId: ObjectId
    type: TokenType
    created: string
}

export enum DataTypes {
    Age = 'age',
    Over21 = 'over21',
    SSN = 'ssn',
    CardPayment = 'cardPayment'
}

export interface SessionParams {
    types: DataTypes[]
    key: string
}

export enum SessionStatus {
    Pending = 'pending',
    Rejected = 'rejected',
    Approved = 'approved',
    Complete = 'complete'
}

export interface Session {
    requestedDataTypes: DataTypes[]
    status: SessionStatus
    accountId?: ObjectId;
    key?: string;
}

export interface SessionRecord extends Session {
    _id: ObjectId
}

export interface Client {
    name: string;
}

export interface ClientRecord extends Client {
    _id: ObjectId
}