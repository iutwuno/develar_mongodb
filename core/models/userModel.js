//--------------------------------------------------------------------
// <copyright file="userModel.js" company="CEPAN">
//     Copyright (c) CEPAN. All rights reserved.
// </copyright>
// <author>Sol Landa - Leonardo Diaz Longhi - Agustin Cassani</author>
//--------------------------------------------------------------------
/**
 * User model
 */
/**
 * Load module dependencies
 */

whoami =  "models/userModel: ";

var mongoose = require('mongoose');

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd3v3l4r';

function encrypt(text){
    console.log('encrypt')
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function comparePasswd (passwd, actualpasswd, cb){
    if(encrypt(passwd) === actualpasswd ){
        cb(false, true);
    }else{
        cb({error: 'passwd erronea '}, false);
    }
}

//var hw = encrypt("hello world")
// outputs hello world
//console.log(hw);
//console.log(decrypt(hw));

 

/**
 * Creación de un Schema
 */
var userSch = new mongoose.Schema({
    username:       { type: String, required: true },
    name:           { type: String, required: true },
    mail:           { type: String, required: true },
    password:       { type: String, required: true },

    displayName:    { type: String, required: true },
    description:    { type: String, required: false },
    cellphone:      { type: String, required: false },

    grupo:          { type: String, required: false },
    roles:          { type: String, required: false },

    fealta:         { type: Date, default: Date.now },
    termsofuse:     { type: Boolean, required: false },
    estado_alta:    { type: String, required: true },
    verificado:     {
                        mail: Boolean,
                        feaprobado: Date,
                        adminuser: String
                    } ,

});

userSch.pre('save', function (next) {
    console.log('[%s] pre-save', whoami)
    var user = this;
    user.displayName = user.displayName || user.name;
    // Check if password has been changed
    if (!user.isModified('password')) {
        return next();
    }else{
        user.password = encrypt(user.password);
        next();
    }
});




// Remove the password from the retrieved user
// userSch.methods.toJSON = function () {
//     var user = this.toObject();
//     delete user.password;

//     return user;
// };

// Compare user passwords
userSch.methods.comparePasswords = function (password, cb) {
    comparePasswd(password, this.password, cb);
};







// Define user mongoose model
/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
var User = mongoose.model('Usuario', userSch, 'usuarios');



/////////   CAPA DE SERVICIOS /////////////
/////////     API DEL USUARIO ///////////
/**
 * Retrieve all usuarios
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    console.log('[%s] findAll',whoami);
    User.find(function(err, users) {
        if (err) {
            errcb(err);
        }else{
            cb(users);
        }
    });
};

/**
 * Sign in selected user
 * @param user
 * @param cb
 * @param errcb
 */
exports.login = function (user, errcb, cb) {
    User.findOne({email: user.email}, function(err, user) {
        if (err) {
            errcb(err);

        }else if(!user) {
            errcb({message: 'email o password incorrecto'});

        }else{
            cb(user);
        }
    });
};


/**
 * Sign up a new user
 * @param user
 * @param cb
 * @param errcb
 */
exports.update = function (id, user, errcb, cb) {

    User.findByIdAndUpdate(id, user, function(err, entity, resultBoolean) {
        if (err){
            console.log('validation error as validate() argument [%s]', resultBoolean)
            err.itsme = 'yew i caughtit TOO';
            errcb(err);
        
        }else{
            console.log('pass validate [%s]', resultBoolean);
            cb(entity);
        }
    });

};


/**
 * Sign up a new user
 * @param user
 * @param cb
 * @param errcb
 */
exports.signup = function (user, errcb, cb) {
    delete user._id;

    User.create(user, function(err, entity, resultBoolean) {
        if (err){
            console.log('validation error as validate() argument [%s]', resultBoolean)
            err.itsme = 'yew i caughtit TOO';
            errcb(err);
        
        }else{
            console.log('pass validate [%s]', resultBoolean);
            cb(entity);
        }
    });

    // promise.catch(err => {
    //     console.log('entity error')
    //     errcb(err);
    // });

    // promise.then(entity => {
    //     console.log('entity promise[%s]', entity.username)
    //     cb(entity);
    // });


    // promise.catch(err => {
    //     console.log('validation error')
    //     err.itsme = 'yew i caughtit'
    //     errcb(err);
    // })


    // User.create(user, function(err, entity) {
    //     if (err) {
    //         console.dir(err)
    //         errcb(err);

    //     }else{
    //         console.log('success: [%s]',entity._id)
    //         cb(entity);
    //     }
    // });
};

/**
 * Sign up a new user
 * @param user
 * @param cb
 * @param errcb
 */
exports.populate = function (errcb, cb) {
    var user = {
        email:'pcasasco@gmail.com',
        password: '234566'
    }
    User.create(user, function(err, user) {
        if (err) {
            errcb(err);

        }else{
            cb(user);
        }
    });
};



//////



