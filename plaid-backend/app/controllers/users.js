import jsonwebtoken from "jsonwebtoken";
import Config from "../../config";
import User from "../models/user";
const { secretKey, expiredAfter } = Config;

const doesUserExists = async (username, password) => {
  return await new Promise(resolve => {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        console.log(err);
        resolve(false);
      }
      // test a matching password
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          console.log(err);
          resolve(false);
        }
        resolve(isMatch);
      });
    });
  });
};

exports.login = async function(req, res) {
  const { username, password } = req.body;
  const response = {};
  let userData = {
    username: username,
    password: password
  };
  //use schema.create to insert data into the db
  // const user = new User(userData);
  // await user.save().then(saved => {
  //   console.log(saved);
  // }).catch(err => console.log(err));
  let logInResult = await doesUserExists(username, password);
  if (logInResult) {
    response.token = jsonwebtoken.sign(
      {
        expiredAt: new Date().getTime() + expiredAfter,
        username,
        id: 1,
      },
      secretKey
    );
    response.status = true;
  } else {
    response.status = false;
  }
  res.json(response);
};

exports.logout = function(req, res) {
  console.log('log out');
};

exports.register = async function (req, res) {
  if (req.body.username && req.body.password) {
    let userData = {
      username: req.body.username,
      password: req.body.password
    };
    //use schema.create to insert data into the db
    const user = new User(userData);
    return await user.save().then(saved => {
      return true;
    }).catch(err => {
      console.log(err);
      return false;
    });
  }
};