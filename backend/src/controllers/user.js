const { User, toUserDTO } = require('../model/user.js');
const express = require('express');
const bcrypt = require('bcryptjs');

const controller = express.Router();

const getUser = async (req, res) => {
    try {
        const nickname = req.params.email ?? req.auth.email;
        const user = await User.findOne({ email });
        // const lastCheck = user.checks.pop();
        if (user) {
            return res.status(200).json({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
                // lastCheck
            });
        } else {
            return res.status(404).send({ message: 'User not found' });
        }
    } catch (err) {
        console.log(err);
    }
};

const updateUser = async (req, res) => {
    try {
        const { firstname, lastname, nickname, password } = req.body;

        if (firstname === '' || lastname === '' || nickname === '') {
            return res
                .status(400)
                .json({ message: "Fields shouldn't be empty!" });
        }

        const id = req.auth.id;

        let userToUpdate = {
            ...(firstname && { firstname }),
            ...(lastname && { lastname }),
            ...(nickname && { nickname })
        };

        if (password) {
            const encryptedPassword = await bcrypt.hash(password, 10);
            userToUpdate = {
                ...userToUpdate,
                password: encryptedPassword
            };
        }

        const updated = await User.findOneAndUpdate({ _id: id }, userToUpdate, {
            new: true
        });

        if (updated) {
            return res.status(201).json(toUserDTO(updated));
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.log(err);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        const dtos = users.map((user) => {
            return {
                firstname: user.firstname,
                lastname: user.lastname,
                nickname: user.nickname
            };
        });

        return res.status(200).json(dtos);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

const increaseUsersRaspberry = async (req, res) => {
    try {
        const { id } = req.body;

        const currentUser = await User.findOne({ _id: id });

        const updated = await User.findOneAndUpdate(
            { _id: id },
            { raspberries: currentUser.raspberries + 1 }
        );

        return res.status(200).json(updated);
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'some shit on our side' });
    }
};

controller.get('/me', getUser);
controller.get('/all', getAllUsers);
controller.get('/:nickname', getUser);
controller.put('/', updateUser);

controller.post('/increaseCounter', increaseUsersRaspberry);

module.exports = controller;
