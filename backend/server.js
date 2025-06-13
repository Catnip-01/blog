const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongo connected !"))
  .catch(err => console.log(err));

// Mongoose schema & model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: { type: String, default: "" },
  name: { type: String, default: "" },
  passingYear: { type: String, default: "" },
  socialLink: { type: String, default: "" },
});

const commentSchema = new mongoose.Schema({
          // username of commenter
  text: String,
  createdAt: { type: Date, default: Date.now }
});


const blogSchema = new mongoose.Schema({
  title: String,
  description: String, 
  content: String,
  author: String,
  imageUrl: String,
  likes: { type: Number, default: 0 },
  comments: [commentSchema],   // <-- commentSchema used here before declaration
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", blogSchema);
const User = mongoose.model("User", userSchema);

app.post("/testpost", (req, res) => {
  res.status(200).send("demo!");
});

// Test MongoDB connection
app.get("/test-mongo", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send("MongoDB connection successful and changes made now");
  } catch (err) {
    res.status(500).send("MongoDB connection failed.");
  }
});

// Register user
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("request contents: " + username);
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json("User already exists");
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({message: "User registered successfully!", redirectTo:"/login"});
    // res.redirect("/login");
  } catch (err) {
    res.status(500).send("Error registering user.");
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("user : " + username);
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).send("Invalid credentials");
    // res.json("Login successful!");
    res.json({ message: "User logged in successfully!", redirectTo: "/" });

  } catch (err) {
    res.status(500).send("Error logging in.");
  }
});

// Get user profile (expects username from query)
app.get("/profile", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json("User not found");

    res.json({
      username: user.username,
      email: user.email || "",
      name: user.name || "",
      passingYear: user.passingYear || "",
      socialLink: user.socialLink || "",
    });
  } catch (err) {
    res.status(500).send("Error fetching profile.");
  }
});


// Update user profile (username or password)
app.put("/profile", async (req, res) => {
  const { username, newUsername, newPassword, email, name, passingYear, socialLink } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json("User not found");

    if (newUsername) user.username = newUsername;
    if (newPassword) user.password = newPassword;
    if (email !== undefined) user.email = email;
    if (name !== undefined) user.name = name;
    if (passingYear !== undefined) user.passingYear = passingYear;
    if (socialLink !== undefined) user.socialLink = socialLink;

    await user.save();
    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    res.status(500).send("Error updating profile.");
  }
});
app.post("/newBlog", async (req, res) => {
  const { title, content, description, author, imageUrl } = req.body;

  if (!author) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const user = await User.findOne({ username: author });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newBlog = new Blog({ title, content, description, author, imageUrl }); // ✅ Include description
    await newBlog.save();

    res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create blog" });
  }
});
// Get all blogs by a specific author
// Get all blogs by a specific author
app.get("/newBlog", async (req, res) => {
  const { author } = req.query;

  try {
    const query = author ? { author } : {};
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

app.get("/profile", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json("User not found");

    const blogs = await Blog.find({ author: username });

    res.json({
      username: user.username,
      email: user.email || "",
      name: user.name || "",
      passingYear: user.passingYear || "",
      socialLink: user.socialLink || "",
      blogs,
    });
  } catch (err) {
    res.status(500).send("Error fetching profile.");
  }
});

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

app.get("/blogs/title/:title", async (req, res) => {
  try {
    const blog = await Blog.findOne({ title: req.params.title });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
});
app.post("/blogs/:title/like", async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { title: req.params.title },
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ likes: blog.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like blog" });
  }
});
app.post('/blogs/:title/comment', async (req, res) => {
  const title = req.params.title;
  const { text } = req.body;  // only text now

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const blog = await Blog.findOne({ title });
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const newComment = { text, createdAt: new Date() };
    blog.comments.push(newComment);

    await blog.save();

    return res.json(blog.comments);  // send updated comments array
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});






app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
