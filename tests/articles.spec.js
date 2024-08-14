const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

describe("Articles API", () => {
    let token;
    const USER_ID = "fakeUserId";
    const ARTICLE_ID = "fakeArticleId";
    const MOCK_ARTICLE = {
        _id: ARTICLE_ID,
        title: "Test Article",
        content: "This is a test article.",
        userId: USER_ID,
    };
    const MOCK_ARTICLE_CREATED = {
        title: "New Test Article",
        content: "This is a newly created test article.",
        userId: USER_ID,
    };

    beforeEach(() => {
        token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);
        mockingoose(Article).toReturn(MOCK_ARTICLE, "findOne");
        mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
    });

    test("[Articles] Create Article", async () => {
        const res = await request(app)
            .post("/api/articles")
            .send(MOCK_ARTICLE_CREATED)
            .set("x-access-token", token);
        expect(res.status).toBe(201);
        expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
    });

    test("[Articles] Update Article", async () => {
        const updatedData = { title: "Updated Test Article" };
        mockingoose(Article).toReturn(updatedData, "findOneAndUpdate");

        const res = await request(app)
            .put(`/api/articles/${ARTICLE_ID}`)
            .send(updatedData)
            .set("x-access-token", token);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe(updatedData.title);
    });

    test("[Articles] Delete Article", async () => {
        mockingoose(Article).toReturn(null, "deleteOne");

        const res = await request(app)
            .delete(`/api/articles/${ARTICLE_ID}`)
            .set("x-access-token", token);
        expect(res.status).toBe(204);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});
