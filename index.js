import express from 'express';
import multer from 'multer'
import mongoose from 'mongoose';
import cors from 'cors';

import {registerValidation, loginValidation, postCreateValidation} from "./validations/index.js";

import {checkAuth, handleValidationErrors} from "./utils/index.js";

import {getMe, login, register} from './controllers/UserController.js';
import {createPost, getAll, getOne, remove, update} from './controllers/PostController.js';

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
app.use(cors());
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
app.post('/auth/login', loginValidation, handleValidationErrors, login);

// Регистрация пользователя:
app.post('/auth/register', registerValidation, handleValidationErrors, register);

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
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, createPost);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update);

app.listen(port, (err) => {
    if (err) {
        return console.log(err + '(×﹏×)');
    } else console.log(`Server started successfully on port: ${port} (´◕‿◕\`)`);
});