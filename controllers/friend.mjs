import User from '../model/Account.mjs';
import jwt from 'jsonwebtoken';

export default class FriendService{
  static m_opponentEmail;
  static m_myEmail;
  
  static setFriendsIdRequest(req){
    // accessToken 미들웨어 검증된 이메일이 들어옴.
    const myEmail = req.email;
    // body를 통해서 상대방의 이메일을 받음.
    const opponentEmail = req.body.opponentEmail;

    this.m_myEmail = myEmail;
    this.m_opponentEmail = opponentEmail;
  }
  static getFriendsIdRequset(){
    return [this.m_myEmail, this.m_opponentEmail];
  } // 0번째 인덱스의 리턴은 자신의 이메일, 1번째 인덱스의 리턴은 상대방의 이메일입니다.


  static async loadFriendsList(myEmail){
    try{
      const returnedMySelf = await User.findOne({useremail: myEmail});
      const friendList = returnedMySelf.friend_list;
      console.log(returnedMySelf);
      return friendList;
    }catch(err){
      console.log(err);
      return null;
    }
  }

  static async loadWaitingFriendList(myEmail){
    try{
      const returnedMySelf = await User.findOne({useremail: myEmail});
      const waitingFriendList = returnedMySelf.friend_waiting_list;

      return waitingFriendList;
    }catch(err){
      console.log(err);

      return null;
    }
  }
  static async addFriendFromId(myEmail, opponentEmail){
    try{
      const returnedMySelf = await User.findOne({useremail: myEmail});
      console.log(returnedMySelf);

      const returnedMyopponent = await User.findOne({useremail: opponentEmail});
      console.log(returnedMyopponent);

      if (returnedMySelf == null){
        console.log("본인 사용자 미등록");
        return false;
      }

      if (returnedMyopponent == null){
        console.log("상대방의 이메일이 정확하지 않아 찾을 수 없습니다.");
        return false; 
      }
  
      const IsSuccess = await this.addFriendFromObject(returnedMySelf, returnedMyopponent);
      if (!IsSuccess){
        return false;
      }
      return true;
    }catch(err){

      console.log("token expired");
      console.log(err);
      return false;
    }
  }

  static async addFriendFromObject(object1, object2){
    // object1은 자기 자신, object2는 상대방이다.
    try{
      const check_Friendlist = object1.friend_list.find(email => email === object2.useremail);
      
      if (check_Friendlist){
        console.log("이미 등록된 친구이다.");
        return false;
      }

      const exists = object2.friend_waiting_list.find(email => email === object1.useremail);
        console.log("-------addFriendFromObject 반영 전 ---------");
        console.log(object2);
        console.log('---------------------------------------------');
      if(exists){
        console.log("친구 요청을 이미 보냈습니다.");
        // null 반환시에 친구 요청을 이미 보냈으니 더 이상 진행을 안하도록 함.
        return false;
      } else {
        object2.friend_waiting_list.push(object1.useremail);
        await object2.save();
        console.log('-------addFriendFromObject 반영 후 ---------');
        console.log(object2);
        console.log('---------------------------------------------');
        return true;
      }
    }catch(err){
      console.log("친구 추가 과정에서 오류 발생: ", err);
      return false;
    }
  }

  static async acceptFrinedFromId(myEmail, opponentEmail){
    try{
      const returnedMySelf = await User.findOne({useremail: myEmail});
      console.log(returnedMySelf);

      const returnedMyopponent = await User.findOne({useremail: opponentEmail});
      console.log(returnedMyopponent);

      if (returnedMySelf == null){
        return false;
      }
      if (returnedMyopponent == null){
        return false; 
      }
      // 성공 여부
      const IsSuccess = await this.acceptFrinedFromObject(returnedMySelf, returnedMyopponent);
      
      if (!IsSuccess){
        
        return false;
      }
      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  } 

  static async acceptFrinedFromObject(object1, object2){
    
    const exists = object1.friend_waiting_list.find(email => email === object2.useremail);

    if (exists){
      // 친구 대기 목록에서 삭제
      console.log('------- acceptFrinedFromObject 반영 전 ---------');
      console.log(object1);
      console.log('---------------------------------------------');
      object1.friend_waiting_list.pull(object2.useremail);
      // 친구 목록에 삽입
      object1.friend_list.push(object2.useremail);
      await object1.save();

      object2.friend_list.push(object1.useremail);
      await object2.save();

      console.log('------- acceptFrinedFromObject 반영 후 ---------');
      console.log(object1);
      console.log('---------------------------------------------');
      return true;
    } else {
      console.log("수락할 친구가 존재하지 않습니다.");
      return false;
    }
  }

  static async declineFriendRequestFromId(myEmail, opponentEmail){
    try{
      const returnedMySelf = await User.findOne({useremail: myEmail});
      console.log(returnedMySelf);

      const returnedMyopponent = await User.findOne({useremail: opponentEmail});
      console.log(returnedMyopponent);

      if (returnedMySelf == null){
        return;
      }
      if (returnedMyopponent == null){
        return; 
      }

      const IsSuccess = await this.declineFriendRequestFromObject(returnedMySelf, returnedMyopponent);
      if (!IsSuccess){
        return false;
      }
      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  static async declineFriendRequestFromObject(object1, object2){
    const exists = object1.friend_waiting_list.find(email => email === object2.useremail);
    console.log(exists);
    if (exists) {
      console.log('------- declineFriendRequestFromObject 반영 전 ---------');
      console.log(object1);
      console.log('---------------------------------------------');
      object1.friend_waiting_list.pull(object2.useremail);
      await object1.save();

      console.log('------- declineFriendRequestFromObject 반영 후 ---------');
      console.log(object1);
      console.log('---------------------------------------------');
      return true;
    } else {
      console.log("거절할 친구가 친구 대기 목록에 존재하지 않습니다.");
      return false;
    }
  }
 
  static async deleteFriendFromId(myEmail, opponentEmail){
    try{
      const returnedMySelf = await User.findOne({useremail: myEmail});
      console.log(returnedMySelf);

      const returnedMyopponent = await User.findOne({useremail: opponentEmail});
      console.log(returnedMyopponent);

      if (returnedMySelf == null){
        return false;
      }
      if (returnedMyopponent == null){
        return false; 
      }
      
      const isSuccess = await this.deleteFriendFromObject(returnedMySelf, returnedMyopponent);

      if(!isSuccess){
        return false;
      }
      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  static async deleteFriendFromObject(object1, object2){
    const exists = object1.friend_list.find(email => email === object2.useremail);

    console.log(object1);
    console.log(object2);
    if (exists) {
      object1.friend_list.pull(object2.useremail);
      object2.friend_list.pull(object1.useremail);  
      await object1.save();
      await object2.save();

      console.log(object1);
      console.log(object2);
      return true;
    } else {
      console.log("삭제할 친구가 존재하지 않습니다.");
      return false;
    }
  }
}



//친구 추가 요청
// app.post('/sendfriendrequest', async (req, res) => {
//   try {
//     // 자기 자신을 나타내는 token 값을 받고 payload에 담겨져있는 email을 받는다.
//     const { token, friendId } = req.body;
    
//     // token 복호화 
    

//     // payload useremail 가져오기

//     // object_id 가져오기.
//     const user = await User.findOne({ useremail: token });
//     const friend = await User.findOne({ useremail: friendId});
//     // user가 존재하는 경우(자기 자신)
//     if (user){
//       if(friend){
//         // friend의 친구 목록 대기창에 user 갱신
//         friend.friend_waiting_list.push(userId);
//         await user.save();

//         res.status(200).json({ message: '친구 요청 전송.' });
//       }else{
//         //친구가 존재하지 않는 경우
//         res.send("not exisited user");
//       }
//     } else {
//       // 연결되지않는 local
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: '에러' });
//   }
// });

// // 친구 요청 수락
// app.post('/acceptfriendrequest', async (req, res) => {
//   try {
//     const { userId, friendId } = req.body;

//     const user = await User.findOne({ useremail: userId });
//     const friend = await User.findOne({ useremail: friendId });

//     // 친구 요청 목록에서 삭제하고 친구로 추가
//     user.friend_waiting_list.pull(friendId);
//     user.friend_list.push(friendId);
//     await user.save();

//     friend.friend_list.push(userId);
//     await friend.save();

//     res.status(200).json({ message: '친구 요청 수락.' });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: '에러' });
//   }
// });

// // 친구 요청 거절
// app.post('/declinefriendrequest', async (req, res) => {
//   try {
//     const { userId, friendId } = req.body;

//     const user = await User.findOne({ useremail: userId });
//     const friend = await User.findOne({ useremail: friendId });

//     // 친구 요청 목록에서 삭제
//     user.friendRequests.pull(friendId);
//     await user.save();
//     friend.friendRequests.pull(userId);
//     await friend.save();

//     res.status(200).json({ message: '친구 요청 거절.' });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: '에러' });
//   }
// });

//   //친구 목록
// app.get('/friendlist', async (req, res) => {
//   try {
//       const userId = req.params.userId;

//       const user = await User.findOne(userId).populate('friends');

//       res.status(200).json({ friends: user.friends });
//   } catch (error) {
//       console.error(error);
//       res.status(400).json({ message: '에러' });
//   }
// });

// //친구 삭제
// app.delete('/removefriend', async (req, res) => {
//   try {
//       const { userId, friendId } = req.body;

//       const user = await User.findOne({ _id: userId });
//       const friend = await User.findOne({ _id: friendId });

//       user.friends.pull(friendId);
//       friend.friends.pull(userId);

//       await user.save();
//       await friend.save();

//       res.status(200).json({ message: '친구 삭제 완료.' });
//   } catch (error) {
//       console.error(error);
//       res.status(400).json({ message: '에러' });
//   }
// });