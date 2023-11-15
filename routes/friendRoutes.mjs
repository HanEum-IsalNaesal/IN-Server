import { Router } from 'express';
import {friendControllers} from '../controllers/friendControllers.mjs';

const router = Router();

router.post("/add", friendControllers.requestFriend);
router.post("/accept", friendControllers.acceptFriendRequest);
router.post("/decline", friendControllers.declineFriendRequest);
router.post("/delete", friendControllers.deleteFriendFromList);
router.post("/loadFriendList", friendControllers.resFriendList);
router.post("/loadWatingFrinedList", friendControllers.resWaitingFriendList);

export default router;