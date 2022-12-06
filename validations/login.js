import {body} from 'express-validator';

export const loginValidation = [
    body('email', "Invalid mail format").isEmail(),
    body('password', "Password must be at least 5 characters").isLength({min: 5}),
];