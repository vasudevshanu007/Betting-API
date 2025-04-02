const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register Controller
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return res.status(400).send({
            success:false,
            message:"Provide all fields"
        })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ 
        success:true,
        message:"User Registered Successfully",
        user 
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  }
};


// Login Controller
const login = async (req, res) => {

  try {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).send({
            success:false,
            message:"Provise email and password"
        })
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User Not Register' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
        success:true,
        message:"User Login Successfully",
         token, 
         user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports= {register,login  }