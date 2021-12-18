import express from 'express'
import path from 'path'
import './database/connection';
import * as dotenv from 'dotenv'
import { routes } from './services/books-service';
import { router_auth } from './services/auth-service';
const cors = require('cors')
dotenv.config()

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors())
app.use(routes);
app.use(router_auth);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.listen(PORT as number, () => console.log(`Server Service - is running at [${process.env.PORT || 3000}] `));