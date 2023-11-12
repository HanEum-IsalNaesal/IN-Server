import {Router} from 'express';
import {OauthControllers} from '../controllers/OauthControllers.mjs';
import {authenticationController} from '../controllers/authenticationController.mjs';
const GOOGLE_CLIENT_ID = '268567930884-ce5s3a5nnjtjv383rilihl0abe9sbja6.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'http://ec2-52-78-237-183.ap-northeast-2.compute.amazonaws.com:80/oauth/google';

const router = Router();

router.get("/test", (req, res) => {
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
    console.log(url);
	res.redirect(url);
});



// proccess for redirect uri 
router.get('/:coperation', OauthControllers.oauth);


export default router;