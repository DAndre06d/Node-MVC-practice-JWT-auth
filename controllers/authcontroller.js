const userDB = {
    users: require("../data/users.json"),
    setUser: function(data) {this.users = data}
}
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");

const fsPromises = require("fs").promises

const handleLogin = async (req, res)=>{
    const {username, pwd} = req.body
    if(!username || !pwd) return res.json({"message": "username and password is required"})
    const foundUser = userDB.users.find((data)=> data.username === username)
    if(!foundUser) return res.sendStatus(401)//unauthorized
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        //create jwt token
        const accessToken = jwt.sign(
            { "username": foundUser.username},
            `${process.env.ACCESS_TOKEN_SECRETS}`,
            { expiresIn: "30s"}
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username},
            `${process.env.REFRESH_TOKEN_SECRETS}`,
            { expiresIn: "1d"}
        )
        //saving refresh token with current user
        const otherUser = userDB.users.filter((data)=> data.users !== foundUser)
        const currentUser = {...foundUser, refreshToken};
        userDB.setUser([...otherUser, currentUser])
        fsPromises.writeFile(path.join(__dirname, "..", "data", "users.json"), JSON.stringify(userDB.users))
        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 *60 *60 * 1000});
        res.json({accessToken});
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin}
;