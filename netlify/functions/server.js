const serverless = require('serverless-http');

const app = require("../../dist/app.js").app;


module.exports.handler = serverless(app,{
     framework: 'express'
});