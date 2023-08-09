// Account models
const Account = require('../model/Account');
const options = require('../config/secretkey');
const jwt = require('jsonwebtoken');

exports.auth = async(req, res, next) => {
    const { rUsername, rPassword} = req.body;
    
    if(rUsername == null || rPassword == null)
    {
        res.send("Invaild credentials");
        return;
    }
    
    var userAccount = await Account.findOne({ username: rUsername });
    console.log(userAccount);
    if(userAccount)
    {
        if(rPassword == userAccount.password){
            try{
                    //Access Token 발급

                const existingUser = {
                    email: userAccount.username,
                    success: true,
                };

                // 유저 정보와 시크릿 키, 알고리즘 입력
                //option.option 액세스토큰은 짧아야하기 때문에 30분으로 설정
                
                // 페이로드, 시크릿키, 헤더 순 
                const AccessToken = jwt.sign(existingUser, options.secretKey, options.option); 

                const refreshToken = jwt.sign(existingUser, options.secretKey, options.option2);

                userAccount.lastAuthentication = Date.now();
                await userAccount.save();

                // key: accessToken, value: AccessToken, 옵션 secure: false https뿐만 아니라 여러 프로토콜이 접근가능
                res.cookie("accessToken", AccessToken, {
                    secure: false, // true일시 https에서만 접근 가능
                    httponly: true, // 오직 웹서버만 접근가능                  
                });

                res.cookie("refreshToken",  refreshToken, {
                    secure: false, // true일시 https에서만 접근 가능
                    httponly: true, // 오직 웹서버만 접근가능
                });
                console.log("Retrieving account...");
                res.send(userAccount);
                next();
                return;
                
            }catch (error){
                if(error){
                    next(error);
                    console.log("access Token과 refresh Token 발급 과정에서 문제가 생겨 다음 함수로 이어질 수가 없다.");
                }
            }
        }
    } else {
        res.send("Invalid credentials");
    }
}

exports.register = async(req, res) =>{
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

        res.status(200)
        .send(
            {result : "success"}
            );

        console.log("아이디 생성");
    }
}