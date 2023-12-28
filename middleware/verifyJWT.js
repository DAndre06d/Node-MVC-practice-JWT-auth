const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401)//Unauthorized
    console.log(authHeader); // this wil give "bearer"
    const token = authHeader.split(" ")[1]
    jwt.verify(
        token,
        `${process.env.ACCESS_TOKEN_SECRET}`,
        (err, data)=>{
            if(err) return res.sendStatus(403)// sends forbidden
            req.user = data.username
            next()
        }
    )

}
module.exports = verifyJWT;