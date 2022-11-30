import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign({
            "email": req.body.email,
            "fullName": "Karina",
        }, 'secret123',
    );

    res.json({
        success: true,
        token,
    })
})

const port = process.env.PORT || 4444;

app.listen(port, (err) => {
    if (err) {
        return console.log(err + ':(');
    } else console.log(`Server started successfully on port: ${port} :)`);
});