const { Schema, model } = require("mongoose");

const Socket = new Schema({
  id: { type: String, require: true }
})

module.exports = model('Socket', Socket)