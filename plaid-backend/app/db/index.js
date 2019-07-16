const mongoose = require("mongoose");
const uri = "mongodb+srv://amacool:amacool@cluster0-45zse.mongodb.net/test";

module.exports.establishConnection = () => {
  return mongoose.connect(uri, {useNewUrlParser: true});
};