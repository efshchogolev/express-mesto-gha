const cardRouter = require("express").Router();
const { getCards, createCard, deleteCard } = require("../controllers/card");

cardRouter.get("/", getCards);
cardRouter.post("/", createCard);
cardRouter.delete("/:cardId", deleteCard);

module.exports = cardRouter;
