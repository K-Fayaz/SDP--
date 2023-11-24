const jwt                   = require("jsonwebtoken");
const User                  = require("../Model/schema.user");
const bcrypt                = require("bcryptjs");
const cookieParser          = require("cookie-parser");

const user_signup = async(req,res)=>{
    try{
        const { username , email , password } = req.body;
        console.log("files from the user is ",req.files)

        const user = await User.findOne({email});
        if(user)
        {
            res.redirect("/auth/login");
        }else{

            // const hash = await bcrypt.hash(password,8);

            const new_user = new User;
            new_user.email = email;
            new_user.username = username;
            new_user.password = password;
            new_user.role = "Teacher";
            // await new_user.save();

            // const payload = {
            //     id: new_user._id,
            //     email: new_user.email,
            // };

            // let token = jwt.sign(payload,process.env.SECRET,{
            //     expiresIn:"1d"
            // });

            // res.cookie("auth",token,{
            //     maxAge:24 * 60 * 60 * 1000,
            //     httpOnly: true
            // })
            // console.log(token);
            res.redirect("/");
        }
    }
    catch(err)
    {
        console.log("Something went Wrong!!");
        console.log(err);
        res.redirect("/auth/signup");
    }
};

const login = async(req,res)=>{
    try{
        console.log(req.body);
        console.log("Hi From Login");
        const { email , password } = req.body;
        const user = await User.findOne({ email });
        if(!user)
        {
            res.redirect("/auth/login");
        }else{

            // check password

            let truthy = await bcrypt.compare(password,user.password);
            if(truthy)
            {
                let payload = {
                    id: user._id,
                    email: email,
                }
                let token = jwt.sign(payload,process.env.SECRET,{
                    expiresIn:"1d",
                });

                res.cookie("auth",token,{
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                });
                console.log(token);
                const redirectUrl = req.session.returnTo || '/';
                res.redirect(redirectUrl);
            }else{
                res.redirect("/auth/login");
            }
        }

    }
    catch(err)
    {
        console.log(err);
    }
}

const logout = async(req,res)=>{
    try{
        const { auth } = req.cookies;
        if(auth)
        {
            console.log("required auth is ",auth);
            res.cookie('auth','',{
                httpOnly: true,
                maxAge: 1,
            });

            res.redirect("/");
        }else{
            res.redirect("/auth/login");
        }   
    }
    catch(err)
    {
        console.log("Somethign Went Wrong",err);
        res.redirect("/auth/login");
    }
}

module.exports = {
    login,
    logout,
    user_signup,
}