const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  
  await User.deleteOne({ email: 'admin@eventsphere.com' });
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await User.create({
    name: 'Admin',
    email: 'admin@eventsphere.com',
    password: hashedPassword,
    role: 'admin',
    college: 'EventSphere'
  });
  
  console.log('Admin created successfully!');
  process.exit();
});