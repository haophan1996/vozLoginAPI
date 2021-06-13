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

api.post('/api/vozlogin', async (req, res) => {

    console.log(req.body);
    var login = req.body['login'];
    var password = req.body['password'];
    var xfToken = req.body['_xfToken'];
    var xfcsrf = req.body['cookie'];
    var userAgent = req.body['userAgent'];
     
    await getLoginToekn(login, password, xfToken, xfcsrf, userAgent,function (body) {
        res.status(200).send({ 
            xf_user: body[0].split(';')[0].split('=')[1],
            date_expire : body[0].split(';')[1].split(',')[1].trim(),
            xf_session: body[1].split(';')[0].split('=')[1]
        });
    }) 
});






async function getLoginToekn(login, password, xfToken, xf_csrf, userAgent,callback) {

    var form = {
        login: login,
        password: password,
        remember: '1',
        _xfToken: xfToken
    };

    var formData = querystring.stringify(form);
    var contentLength = formData.length;

    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'cookie': xf_csrf,
            'user-agent': userAgent,
            'host': 'voz.vn'
        },
        uri: 'https://voz.vn/login/login',
        body: formData,
        method: 'POST'
    }, function (err, res, body) {
        //it works!
        callback(res.headers['set-cookie']); 
        console.log(res.headers['set-cookie'][0].split(';')[0].split('=')[1]); // user
        console.log(res.headers['set-cookie'][0].split(';')[1].split(',')[1].trim());
        console.log(res.headers['set-cookie'][1].split(';')[0].split('=')[1]); // session
    });






}

