const app = require('../src/app');
const connectDB = require('../src/db/db');

// Vercel runs this file as a serverless function. Express handles the routes
// after the database connection is ready.
module.exports = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Unable to initialise API:', error);
    return res.status(500).json({ message: 'Server configuration error' });
  }
};
