const jwt = require('jsonwebtoken');

exports.verifyTokens = (req, res, next) => {
    //토큰을 검증하기위해 메 페이지마다 클라이언트가 가지고 있는 쿠키를 까서 액세스토큰과 리프레시토큰을 확인한다.
    const { accessToken, refreshToken } = req.cookies;
    jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
        if(err){
            // 액세스토큰이 만료되었거나 잘못된 경우
            res.status(401)
            .send(
                    {result : "AccessToken expired"},
                );
        } else {
            // 액세스 토큰이 유효한 경우
            // 디코딩된 정보를 사용
            console.log(decoded);

            //액세스 토큰이 유효하면서 리프레시 토큰 유효한지 검증
            jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decodedrefresh) => {
                if (err) {
                    // 리프레시 토큰이 만료되거나 잘못된 경우
                    res.status(401)
                    .send(
                        {result: "RefreshToken expired"}
                        );
                }else{
                    // 액세스토큰이 유효하면서 리프레시 토큰이 유효
                    console.log(decodedrefresh);

                    next();
                }
            });
        }
    });
};

exports.refreshAccessToken = (req, res) => {
    const { refreshToken } = req.cookies;
  
    // 리프레시 토큰 검증
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        // 리프레시 토큰이 잘못되었거나 만료되었습니다
        res.status(401).
        send(
            {result : "refreshToken expired"},
            );
      } else {
        // 리프레시 토큰이 유효합니다
        // 디코딩된 토큰에서 필요한 정보 추출
        const { decoded_username, decoded } = decoded;
  
        // 새로운 액세스 토큰 생성
        const user = {
          username: decoded_username,
          success: success,
        };
        const newAccessToken = jwt.sign(user, process.env.ACCESS_SECRET, options.option);
  
        // 응답으로 새로운 액세스 토큰 전송
        res.cookie("accessToken", newAccessToken, {
          secure: false,
          httpOnly: true,
        });
      }
    });
  };