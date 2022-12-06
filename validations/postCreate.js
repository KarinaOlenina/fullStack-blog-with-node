import {body} from 'express-validator';

export const postCreateValidation = [
    body('title', "Enter article title").isLength({min: 2}).isString(),
    body('text', "Enter article text").isLength({min: 2}).isString(),
    body('tags', "Invalid tag format").optional().isString(),
    body('imageUrl', "Invalid image link").optional().isString(),
];