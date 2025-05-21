const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Skill = require('../../models/skillModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

const skills = JSON.parse(fs.readFileSync(`${__dirname}/skills.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));

const importData = async () => {
  try {
    await Skill.create(skills);
    await User.create(users);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log('ERROR');

    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Skill.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
