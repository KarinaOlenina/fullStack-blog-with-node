
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
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
};

export const login = async (req, res) => {
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

        const {passwordHash, ...userData} = user._doc;

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
};

export const getMe = async (req, res) => {

    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User is not found (×﹏×)'
            })
        }

        const {passwordHash, ...userData} = user._doc;

        res.status(200).json(userData);
    } catch (err) {
        console.log(err + "No access (×﹏×)")
        res.status(500).json({
            message: "No access (×﹏×)"
        })
    }
};