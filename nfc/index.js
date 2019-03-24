const request = require('request');
const { NFC } = require('nfc-pcsc');

const log = require('debug')('app:nfc');

const nfc = new NFC(); // optionally you can pass logger

nfc.on('reader', reader => {

    log(`${reader.reader.name}  device attached`);

    // enable when you want to auto-process ISO 14443-4 tags (standard=TAG_ISO_14443_4)
    // when an ISO 14443-4 is detected, SELECT FILE command with the AID is issued
    // the response is available as card.data in the card event
    // see examples/basic.js line 17 for more info
    // reader.aid = 'F222222222';

    reader.on('card', card => {
        // card is object containing following data
        // [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
        // [always] String standard: same as type
        // [only TAG_ISO_14443_3] String uid: tag uid
        // [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response

        // log(`${reader.reader.name}  card detected`, card);
        log(card.uid);
        var options = {
            method: 'GET',
            url: `${process.env.SERVICE_HOST}/client/resource/${card.uid}`,
            headers:
            {
                authorization: process.env.CLIENT_KEY
            }
        };
        log(options);
        request(options, (error, response, body) => {
            if (error) throw new Error(error);

            console.log(body);
        });

    });

    reader.on('card.off', card => {
        // log(`${reader.reader.name}  card removed`, card);
    });

    reader.on('error', err => {
        log(`${reader.reader.name}  an error occurred`, err);
    });

    reader.on('end', () => {
        // log(`${reader.reader.name}  device removed`);
    });

});

nfc.on('error', err => {
    log('an error occurred', err);
});