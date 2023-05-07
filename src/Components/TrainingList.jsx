import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Typography } from '@mui/material';
import Sidenav from './Sidenav';
import dayjs from 'dayjs';


function TrainingList() {
      const [trainings, setTrainings] = useState([]);
      const [orderBy, setOrderBy] = useState('date');
      const [order, setOrder] = useState('asc');
      const [search, setSearch] = useState('');

      const fetchData = () => {
  fetch('http://traineeapp.azurewebsites.net/api/trainings')
    .then(resp => resp.json())
    .then(async data => {
      console.log(data.content);
      const trainingsWithCustomers = await Promise.all(
        data.content.map(async training => {
          const customerResponse = await fetch(training.links.find(link => link.rel === 'customer').href);
          const customerData = await customerResponse.json();
          return { ...training, customerName: `${customerData.firstname} ${customerData.lastname}` };
        })
      );
      console.log(trainingsWithCustomers);
      setTrainings(trainingsWithCustomers);
    })
    .catch(error => console.log(error));
};


      useEffect(fetchData, []);

      const handleSort = (property) => (event) => {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
      };



      const columns = [
            { id: 'customerName', label: 'Customer' },
            { id: 'date', label: 'Date' },
            { id: 'duration', label: 'Duration' },
            { id: 'activity', label: 'Activity' },
      ];

      const sortedTrainings = trainings.sort((a, b) => {
            const isAsc = order === 'asc';
            if (a[orderBy] < b[orderBy]) {
                  return isAsc ? -1 : 1;
            }
            if (a[orderBy] > b[orderBy]) {
                  return isAsc ? 1 : -1;
            }
            return 0;
      }).filter(training =>
            training.customerName.toLowerCase().includes(search.toLowerCase()) ||
            training.date.toLowerCase().includes(search.toLowerCase()) ||
            training.duration.toString().toLowerCase().includes(search.toLowerCase()) ||
            training.activity.toLowerCase().includes(search.toLowerCase())
      ).map((trainings) => {
            return {
                  ...trainings,
                  date: dayjs(trainings.date).format('DD.MM.YYYY HH:mm'),
            };
      });

      return (
            <>
                  <Sidenav />

                  <Paper>
                        <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
                              <TableContainer component={Paper} sx={{ border: 1, borderColor: 'primary.main' }}>
                                    <Typography variant='h4' align="left" padding={2}>
                                          Trainings
                                    </Typography>
                                    <TextField
                                          id="search-bar"
                                          label="Search"
                                          variant="outlined"
                                          size="small"
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          InputProps={{
                                                startAdornment: (
                                                      <InputAdornment position="start">
                                                            <SearchIcon />
                                                      </InputAdornment>
                                                ),
                                          }}
                                          sx={{ my: 2 }}
                                    />
                                    <Table size="small" sx={{ borderRadius: '16px' }} aria-label="simple table">
                                          <TableHead>
                                                <TableRow>
                                                      {columns.map(column => (
                                                            <TableCell key={column.id}>
                                                                  <TableSortLabel
                                                                        active={orderBy === column.id}
                                                                        direction={orderBy === column.id ? order : 'asc'}
                                                                        onClick={handleSort(column.id)}
                                                                  >

                                                                        {column.label}
                                                                  </TableSortLabel>
                                                            </TableCell>
                                                      ))}
                                                </TableRow>
                                          </TableHead>
                                          <TableBody>
                                                {sortedTrainings.map(training => (
                                                      <TableRow key={training.links[0].href}>
                                                            {columns.map(column => (
                                                                  <TableCell key={column.id}>{training[column.id]}</TableCell>
                                                            ))}
                                                      </TableRow>
                                                ))}
                                          </TableBody>
                                    </Table>
                              </TableContainer>
                        </Box>
                  </Paper>
            </>
      );
}

export default TrainingList;
