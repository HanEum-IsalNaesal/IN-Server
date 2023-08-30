const qs = require('qs');
const winston = require('winston');
const logger = winston.createLogger();
const axios = require('axios');
const { response } = require('express');
class google {
    constructor(code){
        this.url = 'https://oauth2.googleapis.com/token';
        this.clientID = '268567930884-ce5s3a5nnjtjv383rilihl0abe9sbja6.apps.googleusercontent.com';
        this.SecretPW = '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';
        this.redirectUri = 'http://localhost:13756/oauth/google';
        this.code = code;

        this.userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        
    }
};

const getOption = (coperation, code) => {
    switch(coperation){
        case 'google':
            return new google(code);
    }
}

const getAccessToken = async(options) => {
    
    const resp = await axios.post(options.url, {
        code: options.code,  
        grant_type: 'authorization_code',
        client_id: options.clientID,
        client_secret: options.SecretPW,
        redirect_uri: options.redirectUri,
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',  // 추가된 부분
        },
    });
    return resp.data;
};

const getUserInfo = async (url, access_token) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data
    } catch (error) {
        console.log(error);
    }
    return null;
};

//route : /oauth/google
exports.oauth = async (req, res) => {
    const coperation = req.params.coperation;
    const code = req.query.code;
    

    const options = getOption(coperation, code);
   
    const token = await getAccessToken(options);
    console.log(token.access_token);
    const userInfo = await getUserInfo(options.userInfoUrl, token.access_token);
    res.cookie("accessToken", token.access_token);
    res.cookie("UserName", userInfo.name);
    res.cookie("UserEmail", userInfo.email);
    

    res.send('ok');
}

