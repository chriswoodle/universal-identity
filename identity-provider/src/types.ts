import { ObjectId } from 'mongodb';

export interface LoginParams {
    username: string;
    password: string;
}

export interface AccountParams {
    username: string;
    password: string;
    fullName?: string;
}

export interface Account {
    username: string;
    passwordHash: string;
    fullName?: string;
    created: string;
}

export interface AccountRecord extends Account {
    _id: ObjectId,
}

export interface Token {
    _id: string
    accountId: ObjectId
    created: string
}