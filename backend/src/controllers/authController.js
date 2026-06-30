const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const googleSignIn = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Find or create user
    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        profilePicture: picture,
        role: 'user',
      });
    } else {
      // Update lastLogin and ensure googleId is set
      user.lastLogin = new Date();
      if (!user.googleId) {
        user.googleId = googleId;
      }
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateToken(user);

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(401).json({ message: 'Invalid token or sign-in failed' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

module.exports = {
  googleSignIn,
  logout,
  getCurrentUser,
};
