import Account from '../model/Account.mjs';
import {options} from '../config/secretkey.mjs';
import jwt from 'jsonwebtoken';

    
export const authenticationController = {
    async auth(req, res, next){
        const { rUserEmail, rPassword} = req.body;
        
        if(rUserEmail == null || rPassword == null)
        {
            res.send("Invaild credentials");
            return;
        }
        
        var userAccount = await Account.findOne({ useremail: rUserEmail });
        console.log(userAccount);
        if(userAccount)
        {
            if(rPassword == userAccount.password){
                try{
                        //Access Token 발급
                    
                    const existingUser = {
                        email: userAccount.useremail,
                        success: true,
                    };
    
                    // 유저 정보와 시크릿 키, 알고리즘 입력
                    //option.option 액세스토큰은 짧아야하기 때문에 30분으로 설정
                    
                    // 페이로드, 시크릿키, 헤더 순 
                    const accessToken = jwt.sign(existingUser, options.secretKey, options.option); 
    
                    const refreshToken = jwt.sign(existingUser, options.secretKey, options.option2);
                    console.log(accessToken);
                    console.log(refreshToken);
                    userAccount.lastAuthentication = Date.now();
                    await userAccount.save();
                    
                    // key: accessToken, value: AccessToken, 옵션 secure: false https뿐만 아니라 여러 프로토콜이 접근가능
                    res.cookie("accessToken", accessToken, {
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
            console.log("잘못된 로그인");
        }
    },
    
    async authGoogle(req, res, next){
        const user_email = req.cookies.UserEmail;
        const AccessToken = req.cookies.accessToken;
        const user_name = req.cookies.UserName;
    
        
        // 구글에서 받은 이메일과 패스워드가 없으면 잘못된 정보
        if(user_email == null)
        {
            res.send("Invaild credentials");
            return;
        }
        
        var userAccount = await Account.findOne({ useremail: user_email });
        
    
        if(userAccount)
        {
            
        //Access Token
            userAccount.lastAuthentication = Date.now();
            await userAccount.save();
    
            // 구글에서 받은 액세스토큰을 전달
            res.cookie("accessToken", AccessToken, {
                secure: false, // true일시 https에서만 접근 가능
                httponly: true, // 오직 웹서버만 접근가능                  
            });
            console.log("Retrieving account...");
            res.send("login success");
            console.log("login success");
            next();
            return;
        } else {
            // 구글 로그인에서 전달한 user_email이 데이터베이스에 없으면 계정을 생성.
            var newAccountGoogle = new Account({
                useremail : user_email,
                Name : user_name,
                lastAuthentication : Date.now(),
                isOauthAccount : true,  
            });
            await newAccountGoogle.save();
    
            res.send("sign in");
        }
        
    },
    
    async register(req, res){
        const {rUserEmail, rPassword, rName } = req.body;
        console.log(rName);
        // 회원가입 
        if (rUserEmail == null || rPassword == null || rName == null){
            res.status(404)
            .send(
                {result : "fail"}
                );
        }else{
            // 클라이언트 파라미터가 전부 올바르게 온 경우 계정 생성
            var newAccount = new Account({
                useremail : rUserEmail,
                password : rPassword,
                Name : rName,
                lastAuthentication : Date.now(),
                isOauthAccount : false,  
            });
            await newAccount.save();
    
            res.status(200)
            .send(
                {result : "success"}
                );
    
            console.log("아이디 생성");
        }
    }
}
