//--------------------------------------------------------------------
// <copyright file="userRouter.js" company="CEPAN">
//     Copyright (c) CEPAN. All rights reserved.
// </copyright>
// <author>Sol Landa - Leonardo Diaz Longhi - Agustin Cassani</author>
//--------------------------------------------------------------------
/**
 * User router
 */
/**
 * Load module dependencies
 */
whoami =  "Router:routes/userRouter: ";

var express = require('express');
var router = express.Router();

var service = require('../models/userModel.js');
//var jwt = require('jsonwebtoken');
//var settings = require('../config/settings.js');

/**
 * Retrieve all usuarios
 */
router.get('/', function (req, res) {
    console.log('router root hit');
    service.findAll(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        console.log('findAll success [%s]', entities.length);
        res.status(200).json(entities);

    });
});

/**
 * Retrieve selected user
 */
router.post('/login', function (req, res) {
    console.log('router login hit');
    service.login(req.body, function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(200).json(entity);

    });
});

/**
 * Sign up a new user
 */
router.post('/signup', function (req, res) {
    console.log('router POST signup HIT');

    service.signup(req.body, function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

    });
});

router.put('/signup/:id', function (req, res) {
    console.log('router POST signup HIT');

    service.update(req.params.id, req.body, 
        function (err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});

/**
 * Sign up a new user
 */
router.get('/signup', function (req, res) {
    console.log('router GET signup hit');
});

/**


/**
 * Testing: alta trucha de un user
 */
router.get('/populate', function (req, res) {
    console.log('router populate hit');
    service.populate(function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

    });
});

module.exports = router;