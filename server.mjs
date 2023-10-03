import express from 'express';
import keys from './config/keys.mjs'; // .mjs 확장자로 변경된 파일
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from './controllers/token.mjs'; // .mjs 확장자로 변경된 파일
import methodOverride from 'method-override';
import axios from 'axios';
import {OauthControllers} from './controllers/OauthControllers.mjs'; // .mjs 확장자로 변경된 파일
import router from './routes/index.mjs'; // .mjs 확장자로 변경된 파일

const app = express();

import mongoose from 'mongoose';
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
});

// 미들웨어 함수
app.use(bodyParser.urlencoded({
    extended : true
}));


app.use(express.json());
app.use(cookieParser());
app.use("/", router);

router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));
//controllers
import {authenticationController} from './controllers/authenticationController.mjs';
// Routes


// 로그인


// 구글 계정 선택 화면에서 계정 선택 후 redirect 된 주소
// 아까 등록한 GOOGLE_REDIRECT_URI와 일치해야 함
// 우리가 http://localhost:80/oauth/google를
// 구글에 redirect_uri로 등록했고,
// 위 url을 만들 때도 redirect_uri로 등록했기 때문

// Authorization Server : 인증 서버 => localhost:80/oauth/google


//일반 로그인

//구글 로그인과 회원가입

app.get(jwt.verifyTokens, )
//일반 회원가입



app.listen(keys.port, () => {
    console.log("Listening on " + keys.port);
});
