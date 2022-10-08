const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, toUserDTO } = require('../model/user.js');
const express = require('express');
const { compareFaces } = require('../utils.js');

const controller = express.Router();

const register = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, password } =
            req.body;

        if (!(firstname && lastname && email && phone && password)) {
            console.log('all input', req.body);
            return res.status(400).json({ message: 'All input is required' });
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res
                .status(409)
                .json({ message: 'User Already Exist. Please Login' });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            email,
            phone,
            password: encryptedPassword,
        });

        const token = jwt.sign(
            { id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: 5 * 60 * 60
            }
        );

        const userWithToken = await User.findByIdAndUpdate(
            user._id,
            { token },
            { new: true }
        );

        console.log('userWithToken', userWithToken);

        res.status(201).json(toUserDTO(userWithToken));
    } catch (err) {
        res.status(400).json(err);
    }
};


const login = async (req, res) => {
    try {
        const { email, password, faceID } = req.body;

        if (!(email && password)) {
            res.status(400).json({ message: 'All input is required' });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            let compareRes = compareFaces(user.faceID, faceID);

            if(compareRes < 85){
                res.status(400).json({ message: 'We didn\'t recognize you. Try again' });
            }

            const token = jwt.sign(
                { id: user._id, email, role: user.role },
                process.env.TOKEN_KEY,
                {
                    expiresIn: 5 * 60 * 60
                }
            );

            const updated = await User.findByIdAndUpdate(
                user._id,
                { token },
                { new: true }
            );

            return res.status(200).json(toUserDTO(updated));
        } else {
            return res.status(400).json({ message: 'Invalid Credentials!' });
        }
    } catch (err) {
        console.log(err);
    }
};

controller.post('/register', register);
controller.post('/login', login);

module.exports = controller;
