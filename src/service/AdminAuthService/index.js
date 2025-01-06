import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../../model/adminAuth/index.js';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const adminService = {
  login: async ({ userName, password }) => {
    const admin = await Admin.findOne({ userName });
    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (match) {
        const token = jwt.sign({ userName: admin.userName, role: admin.role }, secretKey, { expiresIn: '10h' });
        admin.sessions.push({ token });
        await admin.save();
        return token;
      }
    }
    return null;
  },

  logout: async (token) => {
    try {
      // Find the admin user whose session contains the given token
      const admin = await Admin.findOne({ 'sessions.token': token });
      if (admin) {
        // Filter out the token from the sessions array
        admin.sessions = admin.sessions.filter(session => session.token !== token);
  
        // Save the updated admin document
        await admin.save();
  
        return true;
      }
  
      return false; // No admin found with the token or the session does not exist
    } catch (error) {
      console.error('Error logging out user:', error);
      return false;
    }
  },
  
  saveResetCode: async (code, email) => {
    const admin = await Admin.findOne({ email });
    if (admin) {
      admin.resetCode = code;
      await admin.save();
      return true;
    }
    return false;
  },

  validateResetCode: async (code) => {
    const admin = await Admin.findOne({ resetCode: code });
    return !!admin;
  },
  updatePassword: async (newPassword) => {
    try {
      const email = 'rajaasgharali009@gmail.com'; // Fixed email
      const admin = await Admin.findOne({ email });
      if (admin) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        admin.resetCode = undefined; // Clear reset code after use
        await admin.save();
        return true;
      }
      return false
    } catch (error) {
      console.error('Error updating password:', error);
      throw new Error('Failed to update password');
    }
  },
  
  

  verifyToken: async (token) => {
    try {
      const decoded = jwt.verify(token, secretKey); // Verify the JWT token
      console.log('Decoded userName:', decoded.userName);
      const admin = await Admin.findOne({ userName: decoded.userName });
      console.log('Admin found:', admin); // Log the found admin  
      // Check if the admin exists and the token matches one of the sessions
      if (admin && admin.sessions.some((session) => session.token === token)) {
        return { isValid: true }; // Return isValid: true if the token is found in the sessions
      }
  
      return { isValid: false }; // Return isValid: false if token not found or session mismatch
    } catch (error) {
      console.error('Error verifying token:', error.message);
      return { isValid: false }; // Return false if any error occurs during token verification
    }
  },
  
};

export default adminService;
