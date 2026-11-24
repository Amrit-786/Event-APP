const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.createEvent({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      organizerId: req.user._id,
      maxParticipants: Number(req.body.maxParticipants),
      category: req.body.category,
      status: req.body.status,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const existing = await Event.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = await Event.updateEvent(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      maxParticipants:
        req.body.maxParticipants !== undefined
          ? Number(req.body.maxParticipants)
          : undefined,
      category: req.body.category,
      status: req.body.status,
    });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const existing = await Event.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await Event.deleteEvent(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function isEventDateClosed(dateValue, timeValue) {
  if (!dateValue) return false;
  const startsAt = new Date(dateValue);
  if (Number.isNaN(startsAt.getTime())) return false;

  const match = String(timeValue || '')
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);

  if (match) {
    startsAt.setHours(
      Number(match[1]),
      Number(match[2]),
      Number(match[3] || 0),
      0
    );
  } else {
    startsAt.setHours(23, 59, 59, 999);
  }

  return Date.now() > startsAt.getTime();
}

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (isEventDateClosed(event.date, event.time)) {
      return res.status(400).json({ message: 'Registration closed — this event has ended' });
    }

    const alreadyRegistered = event.participants.some(
      (p) => (p._id || p.id || p).toString() === req.user._id.toString()
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    await Event.addParticipant(event._id, req.user._id);
    res.json({ message: 'Successfully registered for the event' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const removed = await Event.removeParticipant(event._id, req.user._id);
    if (!removed) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.searchEvents = async (req, res) => {
  try {
    const {
      name,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'asc',
    } = req.query;

    const result = await Event.searchEvents({
      name,
      category,
      startDate,
      endDate,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sortBy,
      sortOrder,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
