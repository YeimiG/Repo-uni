const router = require("express").Router();
const { login } = require("../../controllers/controllersWeb/loginController");

router.post("/login", login);

module.exports = router;