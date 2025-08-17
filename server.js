import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authrouter from "./routes/userRoutes.js";
import mongoose from 'mongoose';
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.use('/api/auth/', authrouter);
app.use('/api/proj/',projectRoutes);
app.use('/api/task/',taskRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('DB Error:', err);
    process.exit(1);
  }
};

startServer();