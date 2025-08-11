const express = require("express");
const ctrl = require("../controllers/ambulanceBooking.controller");
const router = express.Router();

// Passenger endpoints
router.post("/book", ctrl.bookAmbulance);
router.get("/passenger/:passengerId", ctrl.getPassengerBookings);

// Driver endpoints
router.get("/pending", ctrl.getPendingBookings);
router.post("/accept", ctrl.acceptBooking);
router.post("/complete", ctrl.completeBooking);
router.get("/driver/:driverId", ctrl.getDriverBookings);

module.exports = router;