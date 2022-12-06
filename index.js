import express from 'express';
import multer from 'multer'
import mongoose from 'mongoose';

import {registerValidation} from './validations/auth.js';
import {loginValidation} from './validations/login.js';
import {postCreateValidation} from './validations/postCreate.js';
import checkAuth from "./utils/checkAuth.js";

import {getMe, login, register} from './controllers/UserConroller.js';
import {createPost, getAll, getOne, remove, update} from './controllers/PostConroller.js'

const port = process.env.PORT || 4444;

const app = express();

//Создали хранилище multer:
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
//Теперь express знает про uploads (static)
app.use('/uploads', express.static('uploads'));

mongoose
    .connect('mongodb+srv://KarinaOlenina:uF2$G*dA6vHXg!D@cluster0.vlet6is.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB: OK'))
    .catch(err => console.log('DB err', err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Авторизация пользователя:
app.post('/auth/login', loginValidation, login);

// Регистрация пользователя:
app.post('/auth/register', registerValidation, register);

//Получение данных пользователя,
// checkAuth - это middleware
app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//Создание, получение, обновление и удаление статьи
app.get('/posts', getAll);
app.get('/posts/:id', getOne);
//Нужен доступ:
app.post('/posts', checkAuth, postCreateValidation, createPost);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, update);

app.listen(port, (err) => {
    if (err) {
        return console.log(err + '(×﹏×)');
    } else console.log(`Server started successfully on port: ${port} (´◕‿◕\`)`);
});