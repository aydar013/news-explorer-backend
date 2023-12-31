require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("./middlewares/cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const rateLimiter = require("./utils/rate-limiter");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/news_explorer_db", {
  useNewUrlParser: "true",
  useUnifiedTopology: "true",
});

const routes = require("./routes");

app.use(cors);
app.use(helmet());
app.use(requestLogger);
app.use(express.json());
app.use(rateLimiter);

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
