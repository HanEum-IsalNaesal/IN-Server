const bodyParser = require('body-parser');
const Account = require('../model/Account');
const options = require('../config/secretkey');
const jwt = require('jsonwebtoken')

/* const userSchema = new mongoose.Schema({
    username: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  }); */
  

  const User = mongoose.model('User', accountSchema); 

  // 토큰 검증 미들웨어
  function autenticateToken(req, res, next) {

    const token = req.headers.authorization;

    jwt.verify(token, options.secretKey, (err, user) => {
      if (err){
        return res.status(400).json({message : '토큰 검증 실패'});
      }
    
      req.user = user;
      next();

    })
  }
    
  // 친구 추가
  app.post('/sendfriendrequest', async (req, res) => {
    try {
      const userId = req.user.email;
      const friendId = req.body;
  
      const user = await User.findOne({ _id: userId });
      const friend = await User.findOne({ _id: friendId });
  
    // 친구 요청 목록에 추가
    user.friendRequests.push(friendId);
    await user.save();

    res.status(200).json({ message: '친구 요청 전송.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '에러' });
  }
});

// 친구 요청 수락
app.post('/acceptfriendrequest', async (req, res) => {
  try {
    const userId = req.user.email;
    const friendId = req.body;

    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ _id: friendId });

    // 친구 요청 목록에서 삭제하고 친구로 추가
    user.friendRequests.pull(friendId);
    friend.friendRequests.pull(userId);
    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: '친구 요청 수락.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '에러' });
  }
});

// 친구 요청 거절
app.post('/declinefriendrequest', async (req, res) => {
  try {
    const userId = req.user.email;
    const friendId = req.body;

    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ _id: friendId });

    // 친구 요청 목록에서 삭제
    user.friendRequests.pull(friendId);
    friend.friendRequests.pull(userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: '친구 요청 거절.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '에러' });
  }
});

// 친구 목록
app.get('/friendlist', async (req, res) => {
  try {
      const userId = req.params.userId;

      const user = await User.findOne({ _id: userId }).populate('friends');

      res.status(200).json({ friends: user.friends });
  } catch (error) {
      console.error(error);
      res.status(400).json({ message: '에러' });
  }
});

// 친구 삭제
app.delete('/removefriend', async (req, res) => {
  try {
      const userId = req.user.email;
      const friendId = req.body;

      const user = await User.findOne({ _id: userId });
      const friend = await User.findOne({ _id: friendId });

      user.friends.pull(friendId);
      friend.friends.pull(userId);

      await user.save();
      await friend.save();

      res.status(200).json({ message: '친구 삭제 완료.' });
  } catch (error) {
      console.error(error);
      res.status(400).json({ message: '에러' });
  }
});