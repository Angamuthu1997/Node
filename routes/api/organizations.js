const express = require('express');
const passport = require('passport');
const Organization = require('../../models/Organization');
const User = require('../../models/User');
const router = express.Router();


router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ notauthorized: 'User not authorized' });
  }

  const newOrganization = new Organization({
    name: req.body.name
  });

  newOrganization.save().then(org => res.json(org));
});


router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log
  if (req.user.role !== 'admin') {
    return res.status(403).json({ notauthorized: 'User not authorized' });
  }

  Organization.find()
    .then(orgs => res.json(orgs))
    .catch(err => res.status(404).json({ noorgsfound: 'No organizations found' }));
});

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Organization.findById(req.params.id)
    .then(org => res.json(org))
    .catch(err => res.status(404).json({ noorgfound: 'No organization found with that ID' }));
});


router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ notauthorized: 'User not authorized' });
  }

  Organization.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(org => res.json(org))
    .catch(err => res.status(404).json({ noorgfound: 'No organization found with that ID' }));
});


router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ notauthorized: 'User not authorized' });
  }

  Organization.findByIdAndRemove(req.params.id)
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ noorgfound: 'No organization found with that ID' }));
});

module.exports = router;
