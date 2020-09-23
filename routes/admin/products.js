const express = require("express");
const multer = require("multer");
const { handleError, requireAuth } = require("./middleware");

const ProductRepository = require("../../repositories/products");
const newProductHtml = require("../../views/admin/products/new");
const productsListingTemplate = require("../../views/admin/products/index");
const productEditTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await ProductRepository.getAll();
  res.send(productsListingTemplate({ products }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(newProductHtml({ req }));
});

router.post(
  "/admin/products/new",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleError(newProductHtml),
  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await ProductRepository.create({ title, price, image });
    res.redirect("/admin/products");
  }
);

router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await ProductRepository.getOne(req.params.id);
  if (!product) {
    return res.send("Product not found");
  }
  res.send(productEditTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleError(productEditTemplate, async (req) => {
    const product = await ProductRepository.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;
    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }

    await ProductRepository.update(req.params.id, changes);
    res.redirect("/admin/products");
  }
);

router.post("/admin/products/:id/delete", requireAuth, async (req, res) => {
  await ProductRepository.deleteOne(req.params.id);
  res.redirect("/admin/products");
});

module.exports = router;
