const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  content: {
    type: String, 
    maxlength:280
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users"      
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  nbLikes: [{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "users"      
    }],
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
