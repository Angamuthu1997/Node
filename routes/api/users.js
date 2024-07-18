const express = require('express');
const passport = require('passport');
const User = require('../../models/User');
const router = express.Router();


router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log("here users /")
  if (req.user.role !== 'admin') {
    return res.status(403).json({ notauthorized: 'User not authorized' });
  }

  User.find()
    .populate('organization')
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ nousersfound: 'No users found' }));
});

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.params.id)
    .populate('organization')
    .then(user => {
      if (req.user.role !== 'admin' && req.user.id !== user.id.toString()) {
        return res.status(403).json({ notauthorized: 'User not authorized' });
      }
      res.json(user);
    })
    .catch(err => res.status(404).json({ nouserfound: 'No user found with that ID' }));
});


router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ notauthorized: 'User not authorized' });
  }

  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => res.json(user))
    .catch(err => res.status(404).json({ nouserfound: 'No user found with that ID' }));
});


router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ notauthorized: 'User not authorized' });
  }

  User.findByIdAndRemove(req.params.id)
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ nouserfound: 'No user found with that ID' }));
});

module.exports = router;
