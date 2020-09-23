const { check } = require("express-validator");
const userRepo = require("../../repositories/users");

module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage("Title should be in between 1 to 40 characters"),
  requirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Minimum value should be one"),
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const foundEmail = await userRepo.getOneBy({ email: email });
      if (foundEmail) {
        throw new Error("Email in use");
      }
    }),
  requirePassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage(
      "Password must be atleast 4 character in length and not more than 25 characters"
    ),
  requireConfirmPassword: check("confirmPassword")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage(
      "Password must be atleast 4 character in length and not more than 25 characters"
    )
    .custom(async (confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Passwords must match");
      }
    }),
  requireEmailExists: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const user = await userRepo.getOneBy({ email });
      if (!user) {
        throw new Error("User not found");
      }
    }),
  requirePasswordExists: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await userRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error("Invalid User");
      }
      const validPassword = await userRepo.comparePassword(
        user.password,
        password
      );
      if (!validPassword) {
        throw new Error("Password in invalid");
      }
    }),
};
