var connect = require('connect');
var serveStatic = require('serve-static');
var basicAuth = require('basic-auth-connect');
require('dotenv').config();

var app = connect();

app.use(basicAuth(process.env.username, process.env.password));

app.use(serveStatic(__dirname)).listen(process.env.PORT || 8080, function(){
    console.log('Server running on 8080...');
});