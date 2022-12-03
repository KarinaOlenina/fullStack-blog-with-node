import {body} from 'express-validator';

export const registerValidation = [
    body('email', "Invalid mail format").isEmail(),
    body('password', "Password must be at least 5 characters").isLength({min: 5}),
    body('fullName', "Please enter a name, the name cannot be less than 3 characters").isLength({min: 3}),
    body('avatarUrl', "Invalid avatar link").optional().isURL(),
];