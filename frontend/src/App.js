import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState({
    backend: 'checking...',
    database: 'checking...'
  });

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    service: '',
    date: '',
    time: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || '/api';

  useEffect(() => {
    checkStatus();
    fetchBookings();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      setStatus({
        backend: 'Connected',
        database: response.data.database
      });
    } catch (err) {
      setStatus({
        backend: 'Disconnected',
        database: 'Unknown'
      });
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/bookings`, formData);
      setSuccess('Booking created successfully!');
      setFormData({
        customerName: '',
        email: '',
        service: '',
        date: '',
        time: ''
      });
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <h1>🎫 Bookinub - Microservices Demo</h1>

      <div className="status">
        <h2>Service Status</h2>
        <div className="status-item">
          <span className="status-label">Backend Service:</span>
          <span className={`status-value ${status.backend === 'Connected' ? 'connected' : 'disconnected'}`}>
            {status.backend}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Database Service:</span>
          <span className={`status-value ${status.database === 'Connected' ? 'connected' : 'disconnected'}`}>
            {status.database}
          </span>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="booking-form">
        <h2>Create New Booking</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Service:</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              <option value="Haircut">Haircut</option>
              <option value="Massage">Massage</option>
              <option value="Consultation">Consultation</option>
              <option value="Training">Training</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </form>
      </div>

      <div className="bookings-list">
        <h2>All Bookings ({bookings.length})</h2>
        {bookings.length === 0 ? (
          <div className="no-bookings">No bookings yet. Create your first booking!</div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <div className="booking-name">{booking.customerName}</div>
                <div className="booking-service">{booking.service}</div>
              </div>
              <div className="booking-details">
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;