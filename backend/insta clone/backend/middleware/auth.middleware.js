const jwt = require("jsonwebtoken")

async function userverify (req,res,next){
const token = req.cookies.token; //req m hain token cookie m store hoga
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        
    }
    catch (err) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

   req.user = decoded;
    next();
}

module.exports = userverify;