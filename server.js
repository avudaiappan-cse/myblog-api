const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');

const Post = require("./models/Post");


const app = express();

const port = 3000 || process.env.PORT;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) return console.log(err);
    console.log("MongoDB connected successfully!");
  }
);



app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send(post);
  } catch (err) {
    res.status(400).send({ error: "No such post" });
  }
});

const upload = multer({
  limits:{
    fileSize: 1000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('Please upload a image!'));
    }
    cb(undefined, true);
  }
});

app.post("/",upload.single('image'),async (req, res) => {
  try {
    const post = await new Post(req.body);
    post.image = req.file.buffer;
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch("/:id", async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(post);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findOneAndDelete(req.params.id);
    res.send(post);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.listen(port, () => {
  console.log(`Application started listening on PORT ${port}`);
});
