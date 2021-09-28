import querystring from 'querystring';
import request from 'request';


import express, { json } from 'express';
import api from './api/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use(api);

api.get('/', (req,res)=>{
    res.send("Hello vozer | Api date updated: 09/28/2021 | " + port);
});

const server = app.listen(port, ()=> {
    console.log("Welcome to my very frist API called vozfprums support login on port: " + port);
});
 
export default server;