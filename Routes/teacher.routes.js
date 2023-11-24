const express = require("express");
const router  = express.Router();
const controller = require("../controller/controller.attendance");

router.get("/schedule",(req,res)=>{
    res.render("schedule");
});


router.get("/class/:year/:month/:day",controller.class_details);

router.get("/generate/qrcode/:year/:month/:day",controller.generate_qrcode);

module.exports = router;