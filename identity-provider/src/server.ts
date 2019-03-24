import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as joi from 'joi';

import * as types from './types';
import * as api from './api';

import * as modelA from './routes/model-a'

const log = require('debug')('app:server');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan(':method :url :status - :response-time ms'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/client', modelA.client);
app.use('/user', modelA.user);
app.post('/account', (req, res) => {
    const data = req.body;

    const schema = joi.object().keys({
        username: joi.string().required(),
        password: joi.string().required(),
    });

    const result = joi.validate<types.AccountParams>(data, schema);
    if (result.error)
        return res.status(400).json({
            status: 'error',
            message: 'Invalid request data',
            data: data
        });

    log(data);

    api.createAccount(result.value).then(token => {
        return res.send({
            token
        });
    }).catch(error => {
        return res.status(400).json({
            status: 'error',
            message: 'Cannot create account',
            error: error,
            data: data
        });
    })
});

app.post('/login', (req, res) => {
    const data = req.body;

    const schema = joi.object().keys({
        username: joi.string().required(),
        password: joi.string().required(),
    });

    const result = joi.validate<types.LoginParams>(data, schema);
    if (result.error) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid request data',
            data: data
        });
    }
    log(data);

    api.login(result.value).then(token => {
        return res.send({
            token
        });
    }).catch(error => {
        return res.status(400).json({
            status: 'error',
            message: 'Failed to login',
            error: error,
            data: data
        });
    })
});

app.listen(port, () => log(`Example app listening on port ${port}!`))