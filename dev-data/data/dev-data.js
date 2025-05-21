const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Skill = require('../../models/skillModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// console.log(DB);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

const skills = JSON.parse(fs.readFileSync(`${__dirname}/skills.json`));

const importData = async () => {
  try {
    await Skill.create(skills);
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
