const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const cors = require('cors');

const Post = require("./models/Post");


const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
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

app.post("/",async (req, res) => {
  try {
    const post = await new Post(req.body);
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/image/:id", upload.single('image'), async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    post.image = req.file.buffer;
    await post.save();
    res.status(201).send(post);

  }catch(err){
    res.status(400).send();
  }
})

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
