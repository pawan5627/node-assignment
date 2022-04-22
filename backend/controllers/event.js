const Event = require('../models/event');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


//Add new event
exports.addEvent = catchAsyncErrors(async (req, res, next) => {

    const event = await Event.create(req.body);

    res.status(201).json({
        success: true,
        event
    })
})


// Get all events
exports.allEvents = catchAsyncErrors(async (req, res, next) => {
    const events = await Event.find()

    res.status(200).json({
        success: true,
        count: events.length,
        events
    })
})