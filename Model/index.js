const mongoose = require("mongoose");

let url = "mongodb://127.0.0.1:27017/smart-attendance";
mongoose.connect(url)
    .then((data)=>{
        console.log("Connected to Database");
    })
    .catch((err)=>{
        console.log("Something went Wrong!");
        console.log(err);
    })