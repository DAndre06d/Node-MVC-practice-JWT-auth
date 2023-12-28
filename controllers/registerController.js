const userDB = {
    users: require("../data/users.json"),
    setUser: function(data) {this.users = data}
}
const fsPromises = require("fs").promises
const path = require("path")
const bcrypt = require("bcrypt")

const handleNewUser = async(req, res) =>{
    const username = req.body.username
    const pwd = req.body.pwd
    if(!username || !pwd) return res.status(400).json({"message": "User Name and password are required"}) 
    //check for duplicate name in db
    const duplicate = userDB.users.find((data)=> data.username === username)
    if(duplicate) return res.sendStatus(409) //send a status conflict
    try{
        //encrypt the password
        const hashedPassword = await bcrypt.hash(pwd, 10)
        //storew the new user
        const newUser = {'username': username, "password": hashedPassword}
        userDB.setUser([...userDB.users, newUser])
        //wrties the new user in the json file
        await fsPromises.writeFile(
            path.join(__dirname, "..", "data", "users.json"),
            JSON.stringify(userDB.users)
        )
        console.log(userDB.users)
        res.json({"success": `New user: ${username} created!`})
    }catch (err){
        res.status(500).json({"message": err.message})
    }

}
module.exports = {
    handleNewUser
};