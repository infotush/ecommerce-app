const express = require("express");
const userRepo = require("../../repositories/users");
const router = express.Router();
const signUpHtml = require("../../views/admin/auth/signup");
const signInHtml = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requireConfirmPassword,
  requireEmailExists,
  requirePasswordExists,
} = require("../../routes/admin/validators");
const { check, validationResult } = require("express-validator");
const { handleError } = require("./middleware");
router.get("/signup", (req, res) => {
  res.send(signUpHtml({ req }));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requireConfirmPassword],
  handleError(signUpHtml),
  async (req, res) => {
    const { email, password } = req.body;

    //creating user
    const user = await userRepo.createUser({
      email,
      password,
    });
    //storing id using cookies

    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are signed out");
});

router.get("/signin", (req, res) => {
  res.send(signInHtml({}));
});

router.post(
  "/signin",
  [requireEmailExists, requirePasswordExists],
  handleError(signInHtml),
  async (req, res) => {
    const { email } = req.body;
    const user = await userRepo.getOneBy({ email });
    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

module.exports = router;
