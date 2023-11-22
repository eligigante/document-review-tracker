const mysql = require('mysql');
const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret : 'document-tracker-key',
    resave : true,
    saveUninitialized : true
  }));  

app.listen('8001', () => {
    console.log('Server has connected to port 8001')
})
