const bodyParser = require('body-parser');

const User = require('../model/Account');




  //친구 추가 요청
app.post('/sendfriendrequest', async (req, res) => {
  try {
    // 자기 자신을 나타내는 token 값을 받고 payload에 담겨져있는 email을 받는다.
    const { token, friendId } = req.body;
    
    // token 복호화 
    

    // payload useremail 가져오기

    // object_id 가져오기.
    const user = await User.findOne({ useremail: token });
    const friend = await User.findOne({ useremail: friendId});
    // user가 존재하는 경우(자기 자신)
    if (user){
      if(friend){
        // friend의 친구 목록 대기창에 user 갱신
        friend.friend_waiting_list.push(userId);
        await user.save();

        res.status(200).json({ message: '친구 요청 전송.' });
      }else{
        //친구가 존재하지 않는 경우
        res.send("not exisited user");
      }
    } else {
      // 연결되지않는 local
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '에러' });
  }
});

// 친구 요청 수락
app.post('/acceptfriendrequest', async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const user = await User.findOne({ useremail: userId });
    const friend = await User.findOne({ useremail: friendId });

    // 친구 요청 목록에서 삭제하고 친구로 추가
    user.friend_waiting_list.pull(friendId);
    user.friend_list.push(friendId);
    await user.save();

    friend.friend_list.push(userId);
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
    const { userId, friendId } = req.body;

    const user = await User.findOne({ useremail: userId });
    const friend = await User.findOne({ useremail: friendId });

    // 친구 요청 목록에서 삭제
    user.friendRequests.pull(friendId);
    await user.save();
    friend.friendRequests.pull(userId);
    await friend.save();

    res.status(200).json({ message: '친구 요청 거절.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '에러' });
  }
});

  //친구 목록
app.get('/friendlist', async (req, res) => {
  try {
      const userId = req.params.userId;

      const user = await User.findOne(userId).populate('friends');

      res.status(200).json({ friends: user.friends });
  } catch (error) {
      console.error(error);
      res.status(400).json({ message: '에러' });
  }
});

//친구 삭제
app.delete('/removefriend', async (req, res) => {
  try {
      const { userId, friendId } = req.body;

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