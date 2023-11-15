import FriendService from './friend.mjs';

export const friendControllers = {
    async resFriendList (req, res){
        FriendService.setFriendsIdRequest(req); // 요청을 통해서 나의 id와 상대방의 id를 저장합니다.
        const myEmail = FriendService.getFriendsIdRequset()[0];

        const loadFriendsList = await FriendService.loadFriendsList(myEmail);
        console.log(loadFriendsList);
        if(loadFriendsList == null){
            res.status(500).json("failed loading to friends list");
        }

        res.status(200).json(loadFriendsList);
    },

    async resWaitingFriendList (req, res){
        FriendService.setFriendsIdRequest(req); // 요청을 통해서 나의 id와 상대방의 id를 저장합니다.
        const myEmail = FriendService.getFriendsIdRequset()[0];

        const loadWaitingFriendList = await FriendService.loadWaitingFriendList(myEmail);
        if(!loadWaitingFriendList == null){
            res.status(500).json("failed loading to waiting friends list")
        }
        res.status(200).json(loadWaitingFriendList);
    },
    async requestFriend (req, res){
        FriendService.setFriendsIdRequest(req); // 요청을 통해서 나의 id와 상대방의 id를 저장합니다.
        const myEmail = FriendService.getFriendsIdRequset()[0];
        const opponentEmail = FriendService.getFriendsIdRequset()[1];
        //여기 까지 정상 작동

        const addFrined = await FriendService.addFriendFromId(myEmail, opponentEmail);
        
        if(!addFrined){
            res.status(500).json("failed addFriend");
            return;
        }

        res.status(200).json("successed addFriend");
    },
    
    async acceptFriendRequest (req, res){
        FriendService.setFriendsIdRequest(req);
        const myEmail = FriendService.getFriendsIdRequset()[0];
        const opponentEmail = FriendService.getFriendsIdRequset()[1];

        const acceptFriend = await FriendService.acceptFrinedFromId(myEmail, opponentEmail);

        if(!acceptFriend){
            res.status(500).json("failed acceptFriend");
            return;
        }

        res.status(200).json("successed acceptFriend");
    },
    async declineFriendRequest(req, res){
        FriendService.setFriendsIdRequest(req);
        const myEmail = FriendService.getFriendsIdRequset()[0];
        const opponentEmail = FriendService.getFriendsIdRequset()[1];

        const declineFrined = await FriendService.declineFriendRequestFromId(myEmail, opponentEmail);

        if(!declineFrined){
            res.status(500).json("failed declineFriendRequest");
            return;
        }

        res.status(200).json("successed declineFriendRequest");
    },
    async deleteFriendFromList(req, res){
        FriendService.setFriendsIdRequest(req);
        const myEmail = FriendService.getFriendsIdRequset()[0];
        const opponentEmail = FriendService.getFriendsIdRequset()[1];

        const deleteFriend = await FriendService.deleteFriendFromId(myEmail, opponentEmail);

        if(!deleteFriend){
            res.status(500).json("failed deleteFriend");
            return;
        }

        res.status(200).json("successed deleteFriend");
    } 
};