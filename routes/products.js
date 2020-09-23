const express = require("express");
const router = express.Router();
const productRepo = require("../repositories/products");
const allProductsTemplate = require("../views/products/index");

router.get("/", async (req, res) => {
  const products = await productRepo.getAll();
  res.send(allProductsTemplate({ products }));
});

module.exports = router;
