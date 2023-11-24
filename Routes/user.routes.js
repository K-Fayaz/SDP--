const express    = require("express");
const controller = require("../controller/controller.user")


const router  = express.Router();


router.get("/profile",controller.get_profile);


module.exports = router;