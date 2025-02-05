import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import storyRoutes from "./routes/story.js";
import imageRoutes from "./routes/image.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/story', storyRoutes);
app.use('/api/image', imageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
