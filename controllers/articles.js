const Article = require("../models/article");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

const getArticles = (req, res, next) => {
  Article.find({
    owner: req.user._id,
  })
    .then((items) => res.send({ data: items }))
    .catch((e) => next(e));
};

const addArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((item) => res.send({ data: item }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Bad request, invalid data"));
      } else {
        next(e);
      }
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
        return;
      }
      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("You are not authorized to delete this item"));
        return;
      }
      item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(e);
      }
    });
};

module.exports = {
  getArticles,
  addArticle,
  deleteArticle,
};
