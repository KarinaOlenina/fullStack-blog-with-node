import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {registerValidation} from './validations/auth.js';
import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "./models/User.js";

const port = process.env.PORT || 4444;

const app = express();

app.use(express.json());

mongoose
    .connect('mongodb+srv://KarinaOlenina:uF2$G*dA6vHXg!D@cluster0.vlet6is.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB: OK'))
    .catch(err => console.log('DB err', err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Авторизация пользователя:
app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Wrong login or password (×﹏×)',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Wrong login or password (×﹏×)',
            });
        }

        const token = jwt.sign({
                _id: user._id,
            }, 'secret123',
            {
                expiresIn: '30d',
            },
        );

        const {passwordHash, ...userData} = user._doc

        res.status(201).json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err + "Failed to register (×﹏×)")
        res.status(500).json({
            message: "Failed to register (×﹏×)"
        })
    }
})

// Регистрация пользователя:
app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        //Шифрование пароля:
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        //Создаем документ:
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        //Создаем user и сохраняем:
        const user = await doc.save();

        //Создаем token
        const token = jwt.sign({
                _id: user._id,
            }, 'secret123',
            {
                expiresIn: '30d',
            })

        const {passwordHash, ...userData} = user._doc

        // ...user._doc - что-бы получить только находящуюся в doc информацию, без лишних свойств
        res.status(201).json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err + "Failed to register (×﹏×)")
        res.status(500).json({
            message: "Failed to register (×﹏×)"
        })
    }
});

app.get('/auth/me', (req, res) => {

    try {

    } catch (err) {

    }

})

app.listen(port, (err) => {
    if (err) {
        return console.log(err + '(×﹏×)');
    } else console.log(`Server started successfully on port: ${port} (´◕‿◕\`)`);
});