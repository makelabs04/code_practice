const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

function signUser(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}
class AuthController {
  static async register(req, res) {
    try {
      const name = String(req.body.name || '').trim();
      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');
      if (name.length < 2) return res.status(400).json({ success:false, message:'Enter a valid name.' });
      if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success:false, message:'Enter a valid email.' });
      if (password.length < 8) return res.status(400).json({ success:false, message:'Password must be at least 8 characters.' });
      if (await UserModel.findByEmail(email)) return res.status(409).json({ success:false, message:'Email already registered.' });
      const passwordHash = await bcrypt.hash(password, 12);
      const id = await UserModel.create({ name, email, passwordHash });
      const user = { id, name, email };
      res.status(201).json({ success:true, token:signUser(user), user });
    } catch (error) { res.status(500).json({ success:false, message:error.message }); }
  }
  static async login(req, res) {
    try {
      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');
      const user = await UserModel.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ success:false, message:'Invalid email or password.' });
      const safe = { id:user.id, name:user.name, email:user.email };
      res.json({ success:true, token:signUser(safe), user:safe });
    } catch (error) { res.status(500).json({ success:false, message:error.message }); }
  }
  static async me(req, res) {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success:false, message:'User not found.' });
    res.json({ success:true, user });
  }
}
module.exports = AuthController;
