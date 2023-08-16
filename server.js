const express = require('express');
const keys = require('./config/keys');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('./controllers/token');
const methodOverride = require('method-override');
const router = express.Router();
const axios = require('axios');



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

router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));
//controllers
const authenticationRoutes = require('./controllers/authenticationRoutes');

const GOOGLE_CLIENT_ID = '268567930884-ce5s3a5nnjtjv383rilihl0abe9sbja6.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'http://localhost:13756/login/redirect';


// Routes



// 로그인
app.get('/', (req, res) => {
    res.send(`
        <h1>Log in</h1>
        <a href="/login">Log in</a>
    `);
});


app.get('/login', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
	// client_id는 위 스크린샷을 보면 발급 받았음을 알 수 있음
	// 단, 스크린샷에 있는 ID가 아닌 당신이 직접 발급 받은 ID를 사용해야 함.
    url += `?client_id=${GOOGLE_CLIENT_ID}`
	// 아까 등록한 redirect_uri
    // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
    url += '&scope=profile email';
    
    // 로그인 창에서 계정을 선택하면 구글 서버가 이 redirect_uri로 redirect 시켜줌
    url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`
    // 필수 옵션.
    url += '&response_type=code'
  	    
  	// 완성된 url로 이동
  	// 이 url이 위에서 본 구글 계정을 선택하는 화면임.
	res.redirect(url);
});

// 구글 계정 선택 화면에서 계정 선택 후 redirect 된 주소
// 아까 등록한 GOOGLE_REDIRECT_URI와 일치해야 함
// 우리가 http://localhost:3000/login/redirect를
// 구글에 redirect_uri로 등록했고,
// 위 url을 만들 때도 redirect_uri로 등록했기 때문
app.get('/login/redirect', (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);
    res.send('ok');
});

app.post('/account', authenticationRoutes.auth);

// 회원가입

app.post('/registerform', authenticationRoutes.register);

const port = 13756

app.listen(keys.port, () => {
    console.log("Listening on " + keys.port);
});
