import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { Info, AlertCircle, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mocking fetch as backend might not have data populated
      // const vehiclesRes = await axios.get('http://localhost:3000/api/vehicles/documents');
      // const annRes = await axios.get('http://localhost:3000/api/announcements');
      
      setVehicles([
        { vehicleID: 101, imageUrls: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80'], pdfDocumentPaths: [] },
        { vehicleID: 102, imageUrls: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&q=80'], pdfDocumentPaths: [] },
      ]);
      setAnnouncements([
        { id: 1, title: 'Route 1 Delay', message: 'Due to traffic, Route 1 is delayed by 15 mins.', type: 'warning' },
        { id: 2, title: 'New Fleet Added', message: 'Three new buses have been added to the city center route.', type: 'info' }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1e3a8a' }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ mb: 2 }}>Vehicle Fleet</Typography>
          <Grid container spacing={2}>
            {vehicles.map((v) => (
              <Grid item xs={12} sm={6} key={v.vehicleID}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <Box
                    component="img"
                    sx={{ height: 140, width: '100%', objectFit: 'cover' }}
                    alt="Vehicle"
                    src={v.imageUrls[0] || 'https://via.placeholder.com/300x140?text=No+Image'}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Vehicle #{v.vehicleID}
                    </Typography>
                    <Chip label="Active" color="success" size="small" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h5" sx={{ mb: 2 }}>Announcements</Typography>
          <Paper sx={{ p: 0, boxShadow: 3, borderRadius: 2 }}>
            <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
              {announcements.map((ann) => (
                <ListItem key={ann.id} alignItems="flex-start" divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: ann.type === 'warning' ? '#f59e0b' : '#3b82f6' }}>
                      {ann.type === 'warning' ? <AlertCircle /> : <Info />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={ann.title}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {ann.message}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
