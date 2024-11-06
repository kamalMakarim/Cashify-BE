const express = require("express");
const userRoutes = require("./src/routes/user.routes");
const chatRoutes = require("./src/routes/chat.routes");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

require("./src/config/monggo.config").connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});