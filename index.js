var querystring = require('querystring');
var request = require('request');


const express = require('express');
const api = require('./api');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(api);

api.get('/', (req,res)=>{
    res.send("hello " + port);
});

const server = app.listen(port, ()=> {
    console.log("Welcome to my very frist API called vozfprums support login on port: " + port);
});
 
module.exports = server;
