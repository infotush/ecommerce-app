const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const authRouter = require("./routes/admin/auth");
const productRouter = require("./routes/admin/products");
const cartsRouter = require("./routes/carts");
const allProductsRouter = require("./routes/products");
const cookieSession = require("cookie-session");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    keys: ["dhjdfhjdf"],
  })
);

app.use(authRouter);
app.use(productRouter);
app.use(allProductsRouter);
app.use(cartsRouter);

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
