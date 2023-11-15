import tokenService from "./token.mjs";




export async function tokenCheck(req, res, next){
    const accessToken = tokenService.getTokensFromRequest(req)[0];
    const refreshToken = tokenService.getTokensFromRequest(req)[1];
   
    var userEmail = tokenService.getUserIdFromAccessToken(accessToken);
    if(userEmail == null){
        const newAccessToken = tokenService.publishAccessTokenFromRefreshToken(refreshToken);
        console.log(newAccessToken);
        const newPayload = tokenService.decodeAccessToken(newAccessToken);
        res.cookie("accessToken", newAccessToken);
        res.status(404).json("error");
    }
    
    req.email = userEmail;

    next();   
};