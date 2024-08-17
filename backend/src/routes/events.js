const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  createEvent, 
  getEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent, 
  registerForEvent,
  searchEvents
} = require('../controllers/eventController');

router.post('/', protect, createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.get('/search', searchEvents);
router.get('/search', searchEvents);


module.exports = router;