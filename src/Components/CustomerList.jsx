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


function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [orderBy, setOrderBy] = useState('firstname');
  const [order, setOrder] = useState('asc');
  const [search, setSearch] = useState('');

  const fetchData = () => {
    fetch('http://traineeapp.azurewebsites.net/api/customers')
      .then(resp => resp.json())
      .then(data => {
        console.log(data.content); 
        setCustomers(data.content);
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
    { id: 'firstname', label: 'Firstname'},
    { id: 'lastname', label: 'Lastname' },
    { id: 'streetaddress', label: 'Streetaddress' },
    { id: 'postcode', label: 'Postcode' },
    { id: 'city', label: 'City' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
  ];

  const sortedCustomers = customers.sort((a, b) => {
    const isAsc = order === 'asc';
    if (a[orderBy] < b[orderBy]) {
      return isAsc ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  }).filter(customer =>
    customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
    customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
    customer.streetaddress.toLowerCase().includes(search.toLowerCase()) ||
    customer.postcode.toLowerCase().includes(search.toLowerCase()) ||
    customer.city.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <Sidenav />
    
    <Paper>
      <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
        <TableContainer component={Paper} sx={{border: 1, borderColor: 'primary.main'}}>
          <Typography variant='h4' align="left" padding={2}>
            Customers
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
            {sortedCustomers.map(customer => (
              <TableRow key={customer.links[0].href}>
                {columns.map(column => (
                  <TableCell key={column.id}>{customer[column.id]}</TableCell>
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

export default CustomerList;
