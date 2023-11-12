import tokenService from "./token.mjs";




export async function tokenCheck(req, res, next){
    const accessToken = tokenService.getTokensFromRequest(req)[0];
    const refreshToken = tokenService.getTokensFromRequest(req)[1];
    console.log(accessToken);
    console.log(refreshToken);
   
    const userEmail = tokenService.getUserIdFromAccessToken(accessToken);
    
    if(userEmail == null){
        //액세스 토큰에 문제가 생길때,
        publishedAccessToken = tokenService.publishAccessTokenFromRefreshToken(refreshToken);
        userEmail = tokenService.getUserIdFromAccessToken(publishedAccessToken);
    }
    req.email = userEmail;
    next();   
};