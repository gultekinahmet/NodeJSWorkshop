var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    expressJwt = require('express-jwt'),
    morgan = require('morgan'),
    unless = require('express-unless'),
    mongoose = require('mongoose'),
    User = mongoose.mode('User');

module.exports = function(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride());

    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('combined'));
    }

    app.use(function(req, res, next) {
        // Second parameter (*) is which client that will ask us for request.In this code we allowed all clients
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        next();
    });

    app.use(
        expressJwt({
            secret: process.env.JWT_SECRET || 'sssshhhhh'
        }).unless({
            path: ['/api/login', '/api/register']
        })
    );

    app.use(function(req, res, next) {
        User.find( { token: req.token }, function(err, user) {
            if (err) return next(err);
            req.user = user;
            next();
        });
    });

    app.use('/api', require(process.cwd() + '/core/router.js')());
    app.all('*', function(req, res) {
        res.status(404).json({
            success: false,
            data: 'Not found'
        });
    });
};