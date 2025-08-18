import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import authrouter from "./routes/userRoutes.js";
import mongoose from 'mongoose';
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
const app = express();


const corsOptions = {
	origin: true,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'Accept', 'X-Requested-With'],
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.options('*', cors(corsOptions));

app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
	next();
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

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