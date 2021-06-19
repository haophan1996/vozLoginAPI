var querystring = require('querystring');
var request = require('request');

const express = require('express');
const api = express.Router();

//Methods: POST, GET, PATCH, DELETE
//Status: 
//    200 : ok
//    400 : bad request
//    401 : unauthorised
//    402 : payment required
//    404 : not found
//    500 : server error
module.exports = api;

api.get('/api/vozcheck', (req, res) => {
    res.send("hello ");
});

api.post('/api/vozlogin', async (req, res) => {
    await getLoginToekn(req.body['login'], req.body['password'], req.body['_xfToken'], req.body['cookie'], req.body['userAgent'], function (body) {
        
        if (body == 'null') {
            res.status(400).send({
                xf_user: 'incorrect password / or id'
            })
        } else {
            res.status(200).send({
                xf_user: body[0].split(';')[0].split('=')[1],
                date_expire: body[0].split(';')[1].split(',')[1].trim(),
                xf_session: body[1].split(';')[0].split('=')[1]
            });
        } 
    })
    
});


async function getLoginToekn(login, password, xfToken, xf_csrf, userAgent, callback) {

    var form = {
        login: login,
        password: password,
        remember: '1',
        _xfToken: xfToken
    };

    var formData = querystring.stringify(form);
    var contentLength = formData.length;

    console.log(formData);

    await request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded',
            'cookie': xf_csrf,
            'user-agent': userAgent,
            'host': 'voz.vn'
        },
        uri: 'https://voz.vn/login/login',
        body: formData,
        method: 'POST'
    }, async function (err, res, body) { 
        if (res.headers['set-cookie'] == null) { 
            callback('null')
        } else { 
            callback(res.headers['set-cookie'])
        } 
    });

}
