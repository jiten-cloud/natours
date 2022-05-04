const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourmodel');
const Review = require('./../../models/reviewmodel');
const User = require('./../../models/usermodel');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  'PASSWORD',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('connection successfull');
  });

let tour = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
let user = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
let reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tour);
    await Review.create(reviews);
    await User.create(user, { validateBeforeSave: false });
  } catch (error) {
    console.log(error);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();

    console.log('deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] == 'delete') {
  deleteData();
} else if (process.argv[2] == 'import') {
  importData();
}
