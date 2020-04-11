const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "Avudaiappan",
  },
  tags: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now()
  },
  image: {
    type: Buffer
  }
});

module.exports = mongoose.model('Post', PostSchema);
