const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Organization = require('../models/Organization');
const keys = require('../config/keys');

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB successfully connected for seeding');

    await Organization.deleteMany({});
    await User.deleteMany({});

    const org1 = new Organization({ name: 'Organization One' });
    const org2 = new Organization({ name: 'Organization Two' });

    await org1.save();
    await org2.save();

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
      organization: org1._id
    });

    const normalUser = new User({
      name: 'Normal User',
      email: 'user@example.com',
      password: 'password',
      role: 'user',
      organization: org2._id
    });

    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(adminUser.password, salt);
    normalUser.password = await bcrypt.hash(normalUser.password, salt);

    await adminUser.save();
    await normalUser.save();

    console.log('Seeding completed');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error connecting to MongoDB for seeding:', err));
