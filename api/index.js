import { stringify } from 'querystring';
import request from 'request';

import { Router } from 'express';
const api = Router();

//Methods: POST, GET, PATCH, DELETE
//Status: 
//    200 : ok
//    400 : bad request
//    401 : unauthorised
//    402 : payment required
//    404 : not found
//    500 : server error
export default api;

api.get('/api/vozcheck', (req, res) => {
    res.send("hello ");
});


api.post('/api/vozverification', async (req, res) => {
    console.log('Request verification/////////////////////////////////');
    console.log(req.body);
    console.log('End/////////////////////////////////');
    await getLoginVerification(req.body, function (body) {
        if (body['status'] == 'error') {
            res.status(400).send({
                error: body['error']
            })
        } else {  
            if (body['data'].length == 2){
                res.status(200).send({
                    xf_user: body['data'][0].split(';')[0].split('=')[1],
                    date_expire: body['data'][0].split(';')[1].split(',')[1].trim(),
                    xf_session: body['data'][1].split(';')[0].split('=')[1],
                });
            } else if (body['data'].length == 3){
                res.status(200).send({
                    xf_user: body['data'][1].split(';')[0].split('=')[1],
                    date_expire: body['data'][1].split(';')[1].split(',')[1].trim(),
                    xf_session: body['data'][2].split(';')[0].split('=')[1],
                });
            }
        }
    });
})

api.post('/api/vozlogin', async (req, res) => {
    // var login = req.body['login'];
    // var password = req.body['password'];
    // var xfToken = req.body['_xfToken'];
    // var xfcsrf = req.body['cookie'];
    // var userAgent = req.body['userAgent'];
    //console.log(req.body);
    await getLoginToekn(req.body['login'], req.body['password'], req.body['_xfToken'], req.body['cookie'], req.body['userAgent'], function (body) {
        console.log('Request login/////////////////////////////////');
        console.log(req.body);
        console.log('End/////////////////////////////////');
        if (body == 'errCode') {
            res.status(400).send({
                xf_user: 'Cannot connect to server voz.vn'
            })
        }
        else if (body == 'null') {
            res.status(400).send({
                xf_user: 'Incorrect password / or id'
            })
        } else {
            if (body.length == 2) {
                res.status(200).send({
                    type: 0,
                    xf_user: body[0].split(';')[0].split('=')[1],
                    date_expire: body[0].split(';')[1].split(',')[1].trim(),
                    xf_session: body[1].split(';')[0].split('=')[1]
                });
            } else if (body.length == 1) {
                res.status(200).send({
                    type: 1,
                    xf_session: body[0].split(';')[0],
                    checkData : body[0], 
                });
            }
        }
    })

});




async function getLoginVerification(bodyUser, callback) {
    var form = {
        code: bodyUser['code'],
        confirm: '1',
        //trust: '0',
        provider: bodyUser['provider'],
        remember: '1',
        _xfToken: bodyUser['_xfToken'],
        _xfResponseType: 'json'
    };

    var formData = stringify(form);
    var contentLength = formData.length;

    await request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded',
            'cookie': bodyUser['xf_session'] + '; ' + bodyUser['xf_csrf'] + ';',
            'user-agent': 'AndroidIOSAgent',
            'host': 'voz.vn'
        },
        uri: 'https://voz.vn/login/two-step',
        body: formData,
        method: 'POST'
    }, async function (err, res, body) {
        if (res.statusCode != 200 && res.statusCode != 303) {
            callback({
                'status': 'error',
                'error': 'Could not connect to voz.vn'
            });
        }
        else if (JSON.parse(body)['status'] == 'error' && res.statusCode == 200) {
            callback({
                'status': 'error',
                'error': JSON.parse(body)['errors'][0]
            });
        } else {
            callback({
                'status': 'ok',
                'data': res.headers['set-cookie']
            });
        }
    });

}



async function getLoginToekn(login, password, xfToken, xf_csrf, userAgent, callback) {
    var form = {
        login: login,
        password: password,
        remember: '1',
        _xfToken: xfToken
    };

    var formData = stringify(form);
    var contentLength = formData.length;

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
        if (res.statusCode != 200 && res.statusCode != 303) {
            callback('errCode')
        } else if (res.headers['set-cookie'] == null) {
            callback('null')
        } else {
            callback(res.headers['set-cookie'])
        }
    });

}