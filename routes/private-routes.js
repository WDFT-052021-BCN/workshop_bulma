const express = require('express');
const router = express.Router();

const Room = require('./../models/Room.model');

router.get('/profile', (req, res) => {
	res.render('private/profile', { user: req.session.currentUser });
});

router.get('/rooms/add', (req, res) => {
	res.render('rooms/new-room');
});

router.post('/rooms/add', (req, res) => {
	const userId = req.session.currentUser._id;

	const { name, description, imageUrl } = req.body;

	Room.create({
		name,
		description,
		imageUrl,
		owner: userId
	})
		.then((newRoom) => {
			console.log(newRoom);
			res.redirect('/rooms');
		})
		.catch((err) => console.log(err));
});

module.exports = router;
