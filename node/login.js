const mysql = require('mysql');
const server = require('./server');
const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret : 'document-tracker-key',
    resave : true,
    saveUninitialized : true
  }));  

server.startServer();



