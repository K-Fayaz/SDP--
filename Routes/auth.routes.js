const jwt                   = require("jsonwebtoken");
const express               = require("express");
const multer                = require("multer");
const cloudinary            = require("cloudinary");
const controller            = require("../controller/controller.auth");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User                  = require("../Model/schema.user");
const bcrypt                = require("bcryptjs");
const path                  = require("path");


// Configuring Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.API_SECRET,
});


// const storage = new CloudinaryStorage({
//     cloudinary,
//     params:{
//         folder: 'smart attendance',
//         allowed: ['jpeg','png','jpg'],
//     }
// });

const router     = express.Router();

const storage = multer.diskStorage({
    destination: path.join(__dirname,"public/uploads"),
    filename: (req,file,cb)=>{
        cb(null,new Date().getTime() + path.extname(file.originalname));
    }
})

const upload     = multer({ storage });



router.route("/login")
    .get((req,res)=> res.render("login") )
    .post(controller.login)

router.route("/signup")
    .get((req,res)=> res.render("signup") )
    .post(upload.single('profile'),async(req,res)=>{
        try{
            const { username , email , password } = req.body;
            console.log("files from the user is ",req.file)

            const result = await cloudinary.v2.uploader.upload(req.file.path)
            console.log(result);
            
            const user = await User.findOne({email});
            if(user)
            {
                res.redirect("/auth/login");
            }else{
    
                const hash = await bcrypt.hash(password,8);
    
                const new_user = new User;
                new_user.email = email;
                new_user.username = username;
                new_user.password = hash;
                new_user.role = "Student";
                new_user.images.push(result.url);
                await new_user.save();
    
                const payload = {
                    id: new_user._id,
                    email: new_user.email,
                };
    
                let token = jwt.sign(payload,process.env.SECRET,{
                    expiresIn:"1d"
                });
    
                res.cookie("auth",token,{
                    maxAge:24 * 60 * 60 * 1000,
                    httpOnly: true
                })
                console.log(token);
                res.redirect("/");
            }
        }
        catch(err)
        {
            console.log("Something went Wrong!!");
            console.log(err);
            res.redirect("/auth/signup");
        }
    });

router.post("/logout",controller.logout);

module.exports = router;