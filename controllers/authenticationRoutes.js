// Account models
const Account = require('../model/Account');
const options = require('../config/secretkey');
const jwt = require('jsonwebtoken');

exports.auth = async(req, res) => {
    const { rUsername, rPassword} = req.query;
    if(rUsername == null || rPassword == null)
    {
        res.send("Invaild credentials");
        return;
    }
    
    var userAccount = await Account.findOne({ username: rUsername });
    
    if(userAccount)
    {
        if(rPassword == userAccount.password){
            
            //Access Token 발급

            const existingUser = {
                email: existingUser.email,
                success: true,
            };

            // 유저 정보와 시크릿 키, 알고리즘 입력
            //option.option 액세스토큰은 짧아야하기 때문에 30분으로 설정
            const AccessToken = jwt.sign(existingUser, options.secretKey, options.option); 

            const refreshToken = jwt.sign(user2, options.secretKey. option.option2);
            
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

exports.signin = async(req, res) =>{
    const {rUsername, rPassword, rName } = req.body;
    
    // 회원가입 
    if (rUsername == null || rPassword == null || rName == null){
        res.status(404)
        .send(
            {result : "fail"}
            );
    }else{
        // 클라이언트 파라미터가 전부 올바르게 온 경우 계정 생성
        var newAccount = new Account({
            username : rUsername,
            password : rPassword,
            Name : rName,
            lastAuthentication : Date.now(),  
        });
        await newAccount.save();

        res.statusCode(200)
        .send(
            {result : "success"}
            );
    }
}