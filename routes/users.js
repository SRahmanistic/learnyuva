const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var async = require("async");
var flash = require("req-flash")
var nodemailer = require("nodemailer");
var passportLocalMongoose = require("passport-local-mongoose");
var crypto = require("crypto");
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

function sendingmail(user, done){
   var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'ad.learnyuva@gmail.com',
          pass: '9330@#2581ly'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'davidmeghbaan@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
}


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2, teachstu, mobile} = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !teachstu || !mobile) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if(mobile.toString().length === 10){
    //do nothing
  }
  else{
    errors.push({ msg: 'Mobile Number must be a 10 digit number' });
  }
  

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      teachstu,
      mobile
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          mobile,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          mobile,
          teachstu
        });
        
        // console.log(req.body);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
// forgot password
router.get('/forgot', function(req, res) {
    res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash(
                  'error_msg' ,
                  'This email id does not exists!'
                );
          return res.redirect('/users/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: 'ad.learnyuva@gmail.com',
          pass: '9330@#2581ly'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'ad.learnyuva@gmail.com',
        subject: 'LearnYuva Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    let errors = [];
    errors.push({ msg: 'Email is send successfully' });
    res.render('forgot', {
          errors
        });
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/users/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
   // User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
       
        if(req.body.password === req.body.confirm) {
          bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;

            User.findOneAndUpdate({resetPasswordToken: req.params.token }, {password: hash}, (err, data) => {
              if (err) throw err;
              if (!data) {
                  req.flash('error', 'Password reset token is invalid or has expired.');
                  return res.redirect('back');
                }
                sendingmail(data, done);
              return res.redirect('/users/login');
              resetPasswordToken = undefined;
              resetPasswordExpires = undefined;

            })
          });
        });
        } else {
            req.flash(
                  'error_msg' ,
                  'Passwords are not same!'
                );
            console.log('Passwords do not match');
            return res.redirect('back')
        }
      //});
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'ad.learnyuva@gmail.com',
          pass: '9330@#2581ly'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'ad.learnyuva@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success_msg', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});




module.exports = router;
