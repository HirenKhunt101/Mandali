const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.APP_PORT;
const schema = require("./database/database.schema");
const mongo = require("./database/database.service");

// Use the cors middleware
app.use(
  cors({
    origin: "http://localhost:4200", // Replace with the actual origin of your Angular app
    credentials: true,
  })
);

app.use(express.json());

const indexRouter = require("./routes/index");
app.use("/mandali", indexRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Handling preflight requests
app.options("*", cors());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
