import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routers
import userRouter from './routes/user.route.js';

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:false, limit:'16kb'}));
app.use(cookieParser());



app.get('/', (req, res)=> {
    res.send("Hello World");
})

app.use('/api/v1/users', userRouter);


export {
    app
}




