import jwt from 'jsonwebtoken';
import {options} from '../config/secretkey.mjs';


export default class TokenService {
  
  
  static accessToken;
  static refreshToken;



  static getTokensFromRequest = (req) => {
    this.accessToken = this.extractAccessTokenFromRequest(req);
    this.refreshToken = this.extractRefreshTokenFromRequest(req);
    return [this.accessToken, this.refreshToken];
  }

  static getUserIdFromAccessToken = (accessToken, refreshToken) => {
    try{
      const payload = this.decodeAccessToken(accessToken);
      var email = payload.email;
      if (!payload){
        console.log("기존 액세스 토큰이 만료되어 새로운 액세스 토큰 재발급을 시도합니다.");
        const newAccessToken = this.publishAccessTokenFromRefreshToken(refreshToken);
        
        const newPayload = this.decodeAccessToken(newAccessToken);
        
        res.cookie("accessToken", publishedAccessToken, {
          secure: false, // true일시 https에서만 접근 가능
          httponly: true, // 오직 웹서버만 접근가능                  
        });
        
        email = newPayload.email;
      }
      
      return email;
    }catch(err){
      console.log(err);
      return null;
    }
  }

  static extractAccessTokenFromRequest = (req) => {
    const accessToken = req.cookies.accessToken;
    return accessToken;
  }
  static extractRefreshTokenFromRequest = (req) => {
    const refreshToken = req.cookies.refreshToken;
    return refreshToken;
  }
  static decodeAccessToken = (accessToken) => {
    try {
      const decodedPayload = jwt.verify(accessToken, options.secretKey, options.option);
      return decodedPayload;
    } catch(err) {
      console.log(err);
      return null;
    }
  }
  static decodeRefreshToken = (refreshToken) => {
    try {
      const decodedPayload = jwt.verify(refreshToken, options.secretKey, options.option2);
      return decodedPayload;
    } catch(err) {
      console.log(err);
      return null;
    }
  }
  static publishAccessTokenFromRefreshToken = (refreshToken) => {
    if (refreshToken) {
      try{
        const decodedPayload = this.decodeRefreshToken(refreshToken);
        if (decodedPayload == null){
          console.log("리프레시 토큰 만료");
          return null;
        }
        const decoded_useremail = decodedPayload.email;
        //재발급을 위해 새로운 액세스 토큰의 페이로드 생성
        const accessTokenPayload = {
          email: decoded_useremail,
          success : true,
        }

        const newAccessToken = jwt.sign(accessTokenPayload, options.secretKey, options.option);
        this.accessToken = newAccessToken;

        return newAccessToken;
      } catch(err) {
        console.log("publishAccessTokenFromRefreshToken 토큰 발급 과정에서 문제가 생겼습니다.");
        return null;
      }
    }
    if (!refreshToken) {
      // 재접속이 필요한 경우.
    }
  }
}



// exports.verifyTokens = (req, res, next) => {
//     //토큰을 검증하기위해 메 페이지마다 클라이언트가 가지고 있는 쿠키를 까서 액세스토큰과 리프레시토큰을 확인한다.
//     const { accessToken, refreshToken } = req.cookies;
//     jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
//         if(err){
//             // 액세스토큰이 만료되었거나 잘못된 경우
//             res.status(401)
//             .send(
//                     {result : "AccessToken expired"},
//                 );
//         } else {
//             // 액세스 토큰이 유효한 경우
//             // 디코딩된 정보를 사용
//             console.log(decoded);

//             //액세스 토큰이 유효하면서 리프레시 토큰 유효한지 검증
//             jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decodedrefresh) => {
//                 if (err) {
//                     // 리프레시 토큰이 만료되거나 잘못된 경우
//                     res.status(401)
//                     .send(
//                         {result: "RefreshToken expired"}
//                         );
//                 }else{
//                     // 액세스토큰이 유효하면서 리프레시 토큰이 유효
//                     console.log(decodedrefresh);
//                     req.email = decoded.email;
//                     next();
//                 }
//             });
//         }
//     });
// };

// exports.refreshAccessToken = (req, res) => {
//   const { refreshToken } = req.cookies;

//   // 리프레시 토큰 검증
//   jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
//     if (err) {
//       // 리프레시 토큰이 잘못되었거나 만료되었습니다
//       res.status(401).
//       send(
//           {result : "refreshToken expired"},
//           );
//     } else {
//       // 리프레시 토큰이 유효합니다
//       // 디코딩된 토큰에서 필요한 정보 추출
//       const { decoded_username, decoded } = decoded;

//       // 새로운 액세스 토큰 생성
//       const user = {
//         username: decoded_username,
//         success: true,
//       };
//       const newAccessToken = jwt.sign(user, process.env.ACCESS_SECRET, options.option);

//       // 응답으로 새로운 액세스 토큰 전송
//       res.cookie("accessToken", newAccessToken, {
//         secure: false,
//         httpOnly: true,
//     });
//     }
//   });
// };