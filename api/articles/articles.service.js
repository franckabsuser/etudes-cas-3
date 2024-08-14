const Article = require("./articles.schema");

class ArticleService {
    getAll() {
        return Article.find({});
    }

    get(id) {
        return Article.findById(id);
    }

    create(data) {
        const article = new Article(data);
        return article.save();
    }

    update(id, data) {
        return Article.findByIdAndUpdate(id, data, { new: true });
    }

    delete(id) {
        return Article.deleteOne({ _id: id });
    }

    // Method get articles without mdp
    getArticlesByUserId(userId) {
        return Article.find({ userId }).populate('userId', '-password');
    }
}

module.exports = new ArticleService();
