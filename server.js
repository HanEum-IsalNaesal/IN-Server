const express = require('express');
const keys = require('./config/keys');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('./controllers/token');
const methodOverride = require('method-override');
const router = express.Router();



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


// Routes

// 로그인
app.post('/account', authenticationRoutes.auth);

// 회원가입

app.post('/account/signform', authenticationRoutes.signin);

const port = 13756

app.listen(keys.port, () => {
    console.log("Listening on " + keys.port);
});
