import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import ConnectDB from './dbConnector/index.js';
import config from './config/index.js';
import allRoutes from './routes/allRoutes/index.js';
import session from 'express-session';


dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use(passport.initialize());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));


allRoutes(app);

app.get('/', (req, res) => {
  res.send({ code: 200, message: 'Server is running successfully.' });
});

const startServer = async () => {
  try {
    await ConnectDB(config.db, console);
    console.log('✅ Database initialized.');

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Error during server initialization:', error.message);
  }
};

export default startServer;
