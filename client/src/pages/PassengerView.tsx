import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField, Box, Rating, Grid, Alert } from '@mui/material';
import axios from 'axios';

const PassengerView = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(3);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      // Mocking fetch as backend might not have Oracle DB running
      // const response = await axios.get('http://localhost:3000/api/routes');
      // setRoutes(response.data);
      setRoutes([{ id: 1, name: 'Campus to City Center' }, { id: 2, name: 'City Center to Tech Park' }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookTicket = async (routeId: number) => {
    try {
      await axios.post('http://localhost:3000/api/tickets', {
        passengerID: 101, // Mock user ID
        routeID: routeId,
        amount: 2.5,
        paymentMethod: 'Credit Card'
      });
      alert('Ticket Booked Successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to book ticket');
    }
  };

  const handleSubmitReview = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/reviews', {
        passengerID: 101,
        routeID: 1,
        driverID: 201,
        rating: rating,
        feedback: feedback
      });
      setSubmitStatus('Review submitted successfully!');
      setFeedback('');
      setRating(3);
    } catch (err) {
      console.error(err);
      setSubmitStatus('Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1e3a8a' }}>
        Passenger View
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ mb: 2 }}>Available Routes</Typography>
          {routes.map((route) => (
            <Card key={route.id} sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{route.name}</Typography>
                <Button variant="contained" color="primary" onClick={() => handleBookTicket(route.id)}>
                  Book Ticket
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>Leave a Review</Typography>
              {submitStatus && <Alert severity={submitStatus.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{submitStatus}</Alert>}
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleSubmitReview}
                disabled={loading || !feedback}
                fullWidth
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PassengerView;
