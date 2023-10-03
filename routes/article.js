const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getArticles,
  addArticle,
  deleteArticle,
} = require("../controllers/articles");

const {
  validateArticleInfo,
  validateArticleId,
} = require("../middlewares/validation");

// CREATE ARTICLE
router.post("/", auth, validateArticleInfo, addArticle);

// DELETE ARTICLE
router.delete("/:articleId", auth, validateArticleId, deleteArticle);

// FIND ARTICLE
router.get("/", auth, getArticles);

module.exports = router;
