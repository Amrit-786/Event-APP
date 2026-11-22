const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  searchEvents,
} = require('../controllers/eventController');

router.post('/', protect, adminOnly, createEvent);
router.get('/search', searchEvents);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);

module.exports = router;
