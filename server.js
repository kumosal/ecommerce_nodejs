var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var fs = require('fs');
var User = require('./models/user');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsEngine = require('ejs-mate'); 
var app = express();

// connect to the database
mongoose.connect('mongodb://root:123456@ds037622.mlab.com:37622/ecommerce', function(err) {
    if (err) {
        console.log("coudn't connect to the database: " + err);
    } else {
        console.log('Connected to the database');
    }
});

// create a write stream (in append mode) log responses using morgan
var mylogger = fs.createWriteStream(__dirname + '/mylogger.log', {flags: 'a'});

// middlewares
app.use(morgan('dev', { stream: mylogger }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.engine('ejs', ejsEngine);
app.set('view engine', 'ejs');

// create-user route
app.post('/create-user', function(req, res, next) {
    var user = new User();
    
    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;
    
    user.save(function(err) {
       if (err) return next(err);
       res.send('A new user has been created!');
    });
})

// creates a home route
app.get('/', function(req, res) {
   res.render('home'); 
});
// create an about page route
app.get('/about', function(req, res) {
   res.render('about'); 
});

// listen on port 3000
var port = process.env.PORT || 3000;
app.listen(port);