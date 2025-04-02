
const User = require('../models/user')



exports.deposit = async (req, res) => {
  let { amount } = req.body;  // Get deposit amount
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    // ✅ Convert amount to number to prevent string concatenation
    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
    }

    user.balance += amount;   // Add the deposit amount to balance
    await user.save();

    res.status(200).json({
      message: 'Deposit successful',
      balance: user.balance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Deposit failed', error });
  }
};


exports.withdraw = async (req, res) => {
  let { amount } = req.body;  
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    // ✅ Convert amount to number
    amount = Number(amount);

    // ✅ Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    // ✅ Check for insufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // ✅ Perform valid subtraction
    user.balance -= amount;  
    await user.save();

    res.status(200).json({
      message: 'Withdrawal successful',
      balance: user.balance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Withdrawal failed', error });
  }
};
