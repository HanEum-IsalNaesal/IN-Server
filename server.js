const express = require('express');
const keys = require('./config/keys');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('./controllers/token');
const methodOverride = require('method-override');
const axios = require('axios');
const OuathControllers = require('./controllers/OauthControllers');
const router = require("./routes/index");


const mongoose = require('mongoose');
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
const authenticationRoutes = require('./controllers/authenticationRoutes');
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
