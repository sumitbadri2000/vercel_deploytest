const express = require("express");
const { connection } = require("./db");
const { auth } = require("./middleware/Authentication");
const { postR } = require("./routes/post.routes");
const { userR } = require("./routes/user.routes");
const cors=require("cors")
const app = express();
app.use(cors({origin:"*"}))
app.use(express.json());

app.get("/", (req, res) => {
  res.send("home page");
});
app.use("/users", userR);
app.use(auth);
app.use("/posts", postR);
app.listen(1000, async () => {
  try {
    await connection;
    console.log("server");
  } catch (error) {
    console.log(error);
  }
  console.log("1000");
});
