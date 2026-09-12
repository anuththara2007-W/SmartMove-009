import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { TrendingUp, Map } from 'lucide-react';
import axios from 'axios';

const ReportsView = () => {
  const [revenue, setRevenue] = useState<number>(0);
  const [frequentRoutes, setFrequentRoutes] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Mocking fetch as backend might not have Oracle DB running
      // const revRes = await axios.get('http://localhost:3000/api/reports/revenue');
      // const routesRes = await axios.get('http://localhost:3000/api/reports/routes');
      
      setRevenue(12540.50);
      setFrequentRoutes([
        { ROUTEID: 1, ROUTENAME: 'Campus to City Center', TRIPCOUNT: 150 },
        { ROUTEID: 2, ROUTENAME: 'City Center to Tech Park', TRIPCOUNT: 120 },
        { ROUTEID: 3, ROUTENAME: 'Tech Park to Mall', TRIPCOUNT: 95 },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1e3a8a' }}>
        Reports & Analytics
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 4 }}>
              <Box>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>Total Revenue (Month)</Typography>
                <Typography variant="h3" fontWeight="bold">${revenue.toLocaleString()}</Typography>
              </Box>
              <TrendingUp size={48} opacity={0.8} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Map style={{ marginRight: '8px' }} /> Frequent Routes
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
                <TableRow>
                  <TableCell><strong>Route ID</strong></TableCell>
                  <TableCell><strong>Route Name</strong></TableCell>
                  <TableCell align="right"><strong>Trip Count</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {frequentRoutes.map((row) => (
                  <TableRow key={row.ROUTEID} hover>
                    <TableCell>{row.ROUTEID}</TableCell>
                    <TableCell>{row.ROUTENAME}</TableCell>
                    <TableCell align="right">{row.TRIPCOUNT}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsView;
