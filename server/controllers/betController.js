const User = require('../models/user');
const Bet = require('../models/bet');

exports.placeBet = async (req, res) => {
  const { amount, odds } = req.body;  
  const userId = req.user.id;  

  try {
    // Fetch user
    const user = await User.findById(userId);
    
    // Check if user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Simulate bet outcome: Win (50%) or Lose (50%)
    const betWon = Math.random() < 0.5;  

    let payout = 0;

    if (betWon) {
      // Calculate payout if the bet wins
      payout = amount * odds;  
      user.balance += payout;   // Add winnings to user's balance
    } else {
      // Deduct bet amount if the bet loses
      user.balance -= amount;  
    }

    // Save the bet in the database
    const bet = new Bet({
      user: userId,
      amount,
      odds,
      payout: betWon ? payout : 0,   // Store the payout if win
      status: betWon ? 'won' : 'lost'
    });

    await bet.save();
    await user.save();

    // Respond with bet outcome
    res.status(201).json({
      message: `Bet ${betWon ? 'won' : 'lost'}`,
      bet: {
        amount,
        odds,
        payout: betWon ? payout : 0,
        status: betWon ? 'won' : 'lost',
        balance: user.balance
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
