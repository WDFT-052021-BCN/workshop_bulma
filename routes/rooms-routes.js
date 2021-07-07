const express = require('express');
const router = express.Router();

const Room = require('./../models/Room.model');
const Review = require('./../models/Review.model');

router.get('/', (req, res) => {
	Room.find()
		.populate('owner')
		.then((allRooms) => {
			console.log('allRooms', allRooms);
			res.render('rooms/all-rooms', { allRooms });
		})
		.catch((err) => console.log(err));
});

router.get('/:id', (req, res) => {
	const { id } = req.params;

	Room.findById(id)
		.populate('owner')
		.populate({
			path: 'reviews',
			populate: {
				path: 'user'
			}
		})
		.then((room) => {
			console.log('room', room);
			res.render('rooms/one-room', { room });
		})
		.catch((err) => console.log(err));
});

router.post('/:id', (req, res) => {
	const roomId = req.params.id;
	const userId = req.session.currentUser._id;
	const comment = req.body.comment;

	console.log(roomId, userId, comment);

	Review.create({
		user: userId,
		comment
	})
		.then((newReview) => {
			Room.findByIdAndUpdate(
				roomId,
				{
					$addToSet: { reviews: newReview.id }
				},
				{ new: true }
			)
				.then((updatedRoom) => {
					console.log(updatedRoom);
					res.redirect(`/rooms/${roomId}`);
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
	res.redirect(`/rooms/${roomId}`);
});

module.exports = router;
