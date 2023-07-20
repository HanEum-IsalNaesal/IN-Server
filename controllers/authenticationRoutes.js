// Account models
const Account = require('../model/Account');

exports.auth = async(req, res) => {
    const { rUsername, rPassword} = req.query;
    if(rUsername == null || rPassword == null)
    {
        res.send("Invaild credentials");
        return;
    }
    
    var userAccount = await Account.findOne({ username: rUsername });
    
    if(userAccount == null)
    {
        //Create a new account
        console.log("Create new account");

        var newAccount = new Account({
            username : rUsername,
            password : rPassword,
            
            lastAuthentication : Date.now()  
        });
        await newAccount.save();

        res.send(newAccount);
        return;
    } else {
        if(rPassword == userAccount.password){
            userAccount.lastAuthentication = Date.now();
            await userAccount.save();

            console.log("Retrieving account...");
            res.send(userAccount);
            return;
        }
    }
    res.send("Invalid credentials");
    return;
}