var querystring = require('querystring');
var request = require('request');


const express = require('express');
const api = require('./api');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(api);

const server = app.listen(port, ()=> {
    console.log("Welcome to my very frist API called vozfprums support login on port: " + port);
});
 
module.exports = server;















// var form = {
//     login: 'meoso123',
//     password: 'gietdao9x',
//     remember: '1',
//     _xfToken: '1623535491,2f2f8f4e97069f2a4fef0aa8c1734277'
// };

// var formData = querystring.stringify(form);
// var contentLength = formData.length;

// request({
//     headers: {
//         'Content-Length': contentLength,
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//         'cookie': 'xf_csrf=MZjFS1X-5Zc5UPfQ',
//         'user-agent': 'meoso12sacsacsa',
//         'host': 'voz.vn'
//     },
//     uri: 'https://voz.vn/login/login',
//     body: formData,
//     method: 'POST'
// }, function (err, res, body) {
//     //it works!
//     console.log(JSON.stringify(res.headers['set-cookie']));
// });

