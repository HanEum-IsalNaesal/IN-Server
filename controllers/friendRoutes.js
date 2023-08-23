const bodyParser = require('body-parser');

const userSchema = new mongoose.Schema({
    username: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  });
  
  const User = mongoose.model('User', userSchema);
  
  app.post('/addfriend', async (req, res) => {
    try {
      const { userId, friendId } = req.body;
  
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
  
      user.friends.push(friendId);
      friend.friends.push(userId);

      await user.save();
      await friend.save();
  
      res.status(200).json({ message: '친구 추가 완료.' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: '에러' });
    }
  });