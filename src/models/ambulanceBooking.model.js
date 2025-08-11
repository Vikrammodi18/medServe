// Simple in-memory model for demonstration. Replace with DB logic in production.

let bookings = [];
let bookingId = 1;

/**
 * Creates a new ambulance booking.
 * @param {string} passengerId
 * @param {string} passengerName
 * @param {string} passengerPhone
 * @param {string} pickupLocation
 * @param {string} dropLocation
 * @returns {object} booking
 */
const createBooking = (passengerId, passengerName, passengerPhone, pickupLocation, dropLocation) => {
  const booking = {
    id: bookingId++,
    passengerId,
    passengerName,
    passengerPhone,
    pickupLocation,
    dropLocation,
    status: "pending", // pending, accepted, completed, cancelled
    driverId: null,
    completedAt: null
  };
  bookings.push(booking);
  return booking;
};

/**
 * Returns bookings matching the filter.
 * @param {object} filter
 * @returns {array} bookings
 */
const getBookings = (filter = {}) =>
  bookings.filter((b) =>
    Object.entries(filter).every(([k, v]) => b[k] == v)
  );

/**
 * Finds a booking by its ID.
 * @param {number|string} id
 * @returns {object|null} booking
 */
const findBookingById = (id) => bookings.find((b) => b.id == id);

/**
 * Updates a booking with specified fields.
 * @param {number|string} id
 * @param {object} updates
 * @returns {object|null} booking
 */
const updateBooking = (id, updates) => {
  const index = bookings.findIndex((b) => b.id == id);
  if (index === -1) return null;
  bookings[index] = { ...bookings[index], ...updates };
  return bookings[index];
};

module.exports = {
  createBooking,
  getBookings,
  findBookingById,
  updateBooking,
};