import tokenService from "./token.mjs";




export async function tokenCheck(req, res, next){
    const accessToken = tokenService.getTokensFromRequest(req)[0];
    const refreshToken = tokenService.getTokensFromRequest(req)[1];
   
    var userEmail = tokenService.getUserIdFromAccessToken(accessToken, refreshToken);
    req.email = userEmail;
    next();   
};