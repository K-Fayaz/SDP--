const jwt  = require("jsonwebtoken");
const User = require("../Model/schema.user");

const isLoggedIn = async(req,res,next)=>{
    try{
        if(req.cookies.auth)
        {
            const payload = jwt.verify(req.cookies.auth,process.env.SECRET);
            console.log(payload);
            const user = await User.findById(payload.id);
            if(user)
            {
                console.log(user);
                res.locals.authUser = user._id;
            }else{
                throw Error("User not Found");
            }
            next();
        }
        else{
            console.log("You need to login first");
            req.session.returnTo = req.originalUrl;
            console.log(req.session.returnTo)
            res.redirect("/auth/login");
        }
    }
    catch(err)
    {
        console.log("Something Went Wrong",err);
    }
}

module.exports = isLoggedIn;