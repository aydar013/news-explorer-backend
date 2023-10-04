require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const rateLimit = require("express-rate-limit");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/news_explorer_db", (r) => {
  console.log("connected to DB", r);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // maximum 100 requests per windowMs
});

const routes = require("./routes");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
