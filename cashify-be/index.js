const express = require("express");
const userRoutes = require("./src/routes/user.routes");
const trashRoutes = require('./src/routes/trash.routes');
const collectionCenterRoutes = require('./src/routes/collection_center.routes');
const cors = require('cors');

require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

require("./src/config/mongo.config").connectDB();
app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'Cookie']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/trash", trashRoutes);
app.use("/collection-center", collectionCenterRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});