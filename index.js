import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet  from "helmet";
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler,notFound } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();
const app=express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => res.render('home'));
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
app.get("/tasks/new", (req, res) => {
     res.render("task");
   });

   app.get("/tasks/update", (req, res) => {
     res.render("update");
   });
   
   


app.use('/api/auth',authRoutes);
app.use('/api/tasks',taskRoutes);

app.use(notFound);
app.use(errorHandler);


app.listen(process.env.PORT || 4140, () => 
     console.log(`Server running on port ${process.env.PORT || 4140}`));