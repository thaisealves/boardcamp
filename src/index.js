import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/routesIndex.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
