const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const db = require("./models");

const recordsRouter = require("./routes/Records");
app.use("/records", recordsRouter);
const authRouter = require("./routes/Users");
app.use("/auth", authRouter);

db.sequelize.sync().then(() => {
    app.listen (3001, () =>{
        console.log("Server running on port 3001.");
    });
});
    