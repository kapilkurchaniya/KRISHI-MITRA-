const userModel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/cache');


async function register(req, res) {
   const { username, email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ $or:
             [
                { username },
                 { email }] 
            });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,  
            password: hashedPassword
        }); 
    
    const token = jwt.sign(
        { 
        id: user._id , username: user.username
    }
    , process.env.JWT_SECRET, { expiresIn: '3d' });
    res.cookie('token', token);
     res.status(201).json({ message: 'User registered successfully'
        ,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
      });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function login(req, res) {
    const { email,username, password } = req.body;
    try {
        const user = await userModel.findOne({$or: [{ email }, { username }]});
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );
        res.cookie('token', token);
        res.status(200).json({ message: 'Login successful' ,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
        });


    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
async function getMe(req, res) {
  const user = await userModel.findById(req.user._id).select('-password');
  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({
      message: 'User details retrieved successfully',
      user: {
          id: user._id,
          username: user.username,
          email: user.email
      }
  });
}
async function logout(req, res) {
    const token = req.cookies.token;
    if (token) {
        await redisClient.set(token, Date.now().toString());
    }
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}



module.exports = {
    register,login,getMe,logout
};