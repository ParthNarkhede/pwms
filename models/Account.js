const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // to associate with a user
    ref: "users",
    required: true,  // make sure it's always required
  },
  accessToken: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  institutionId: {
    type: String,
    required: true,
  },
  institutionName: {
    type: String,
  },
  accountName: {
    type: String,
  },
  accountType: {
    type: String,
  },
  accountSubtype: {
    type: String,
  },
});

AccountSchema.index({ userId: 1 });  // Index for fast lookups by userId

module.exports = Account = mongoose.model("account", AccountSchema);
