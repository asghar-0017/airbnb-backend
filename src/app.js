import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./dbConnector/index.js";
import config from "./config/index.js";
import allRoutes from "./routes/allRoutes/index.js";
// import authRoute from "./routes/authRoute/index.js";

dotenv.config();

const app = express();
app.use(cors({
origin:'*'

}));

const logger = {
    info: (msg) => console.log(`INFO: ${msg}`),
    error: (msg) => console.error(`ERROR: ${msg}`),
  };
  

app.use(express.json());
allRoutes(app)
// authRoute(app)
app.get("/", (req, res) => {
  res.send({ code: 200, message: "Server is running successfully." });
});

const startServer = async () => {
  try {
    await ConnectDB(config.db, logger);  
    console.log("✅Database initialized.");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Error during server initialization:", error.message);
  }
};



export default startServer