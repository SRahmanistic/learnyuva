const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome', {
    user: req.user
  }));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);





























// routes for courses, aboutus and contact us
router.get('/app', forwardAuthenticated, (req, res) => res.render('courses/app', {
    user: req.user
  }) );
// router.get('/c', forwardAuthenticated, (req, res) => res.render('courses/c', {
//     user: req.user
//   }) );
// router.get('/drone', forwardAuthenticated, (req, res) => res.render('courses/drone', {
//     user: req.user
//   }) );
router.get('/cpp', forwardAuthenticated, (req, res) => res.render('courses/cpp', {
    user: req.user
  }));
router.get('/dm', forwardAuthenticated, (req, res) => res.render('courses/dm', {
    user: req.user
  }));
router.get('/french', forwardAuthenticated, (req, res) => res.render('courses/french', {
    user: req.user
  }));
router.get('/game', forwardAuthenticated, (req, res) => res.render('courses/game', {
    user: req.user
  }));
router.get('/german', forwardAuthenticated, (req, res) => res.render('courses/german', {
    user: req.user
  }));
router.get('/ios', forwardAuthenticated, (req, res) => res.render('courses/ios', {
    user: req.user
  }));
router.get('/iot', forwardAuthenticated, (req, res) => res.render('courses/iot', {
    user: req.user
  }));
router.get('/java', forwardAuthenticated, (req, res) => res.render('courses/java', {
    user: req.user
  }));
router.get('/python', forwardAuthenticated, (req, res) => res.render('courses/python', {
    user: req.user
  }));
router.get('/robotic', forwardAuthenticated, (req, res) => res.render('courses/robotic', {
    user: req.user
  }));
router.get('/spanish', forwardAuthenticated, (req, res) => res.render('courses/spanish', {
    user: req.user
  }));
router.get('/web', forwardAuthenticated, (req, res) => res.render('courses/web', {
    user: req.user
  }));
router.get('/aboutus', forwardAuthenticated, (req, res) => res.render('aboutus', {
    user: req.user
  }));
router.get('/contactus', forwardAuthenticated, (req, res) => res.render('contactus', {
    user: req.user
  }));
module.exports = router;
