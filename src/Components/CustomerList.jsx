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
import NewCustomer from './NewCustomer';
import NewTraining from './NewTraining';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [orderBy, setOrderBy] = useState('firstname');
  const [order, setOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [cellModesModel, setCellModesModel] = useState({});

  const fetchData = () => {
    fetch('http://traineeapp.azurewebsites.net/api/customers')
      .then(resp => resp.json())
      .then(data => {
        console.log(data.content);
        setCustomers(data.content);
      })
      .catch(error => console.log(error));
  };

  const saveCustomer = customer => {
    const options = {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    };
    fetch('http://traineeapp.azurewebsites.net/api/customers', options)
      .then(resp => fetchData())
      .catch(error => console.error(error))
  };
  const saveTraining = training => {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(training)
    };
    fetch('http://traineeapp.azurewebsites.net/api/trainings', options)
      .then(resp => fetchData())
      .catch(error => console.error(error));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Do you want to delete this customer?")) return;
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`http://traineeapp.azurewebsites.net/api/customers/${id}`, options)
      .then((resp) => fetchData())
      .catch((error) => console.error(error));
  };

  const handleSave = (id, field, newValue) => {
    const customer = customers.find((customer) => {
      const customerId = customer.links[0].href.split('/').pop();
      return customerId === id;
    });

    const updatedCustomer = { ...customer, [field]: newValue };

    delete updatedCustomer.links;

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCustomer),
    };
    fetch(`http://traineeapp.azurewebsites.net/api/customers/${id}`, options)
      .then((resp) => fetchData())
      .catch((error) => console.error(error));

    setCellModesModel({
      ...cellModesModel,
      [id]: { ...cellModesModel[id], [field]: { mode: 'view' } },
    });
  };


  const handleCancel = (id, field) => {
    setCellModesModel({
      ...cellModesModel,
      [id]: { ...cellModesModel[id], [field]: { mode: 'view' } },
    });
  };

  const EditableTableCell = ({ row, column }) => {
    const id = row.links[0].href.split('/').pop();
    const field = column.id;
    const cellMode = cellModesModel[id]?.[field]?.mode || 'view';

    const [inputValue, setInputValue] = useState(row[field]);

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    if (cellMode === 'edit') {
      return (
        <TableCell>
          <TextField
            defaultValue={row[field]}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancel(id, field);
              }
            }}
            autoFocus
          />
          <button onClick={() => handleSave(id, field, inputValue)}>Save</button>
          <button onClick={() => handleCancel(id, field)}>Cancel</button>
        </TableCell>
      );
    } else {
      return (
        <TableCell
          onClick={() =>
            setCellModesModel({
              ...cellModesModel,
              [id]: { ...cellModesModel[id], [field]: { mode: 'edit' } },
            })
          }
        >
          {row[field]}
        </TableCell>
      );
    }
  };






  useEffect(fetchData, []);

  const handleSort = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const columns = [
    { field: 'firstname', id: 'firstname', label: 'Firstname' },
    { field: 'lastname', id: 'lastname', label: 'Lastname' },
    { field: 'streetaddress', id: 'streetaddress', label: 'Streetaddress' },
    { field: 'postcode', id: 'postcode', label: 'Postcode' },
    { field: 'city', id: 'city', label: 'City' },
    { field: 'email', id: 'email', label: 'Email' },
    { field: 'phone', id: 'phone', label: 'Phone' },
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
        <Box sx={{ position: 'relative' }}>
          <NewCustomer saveCustomer={saveCustomer} />
          <TableContainer component={Paper} sx={{ border: 1, borderColor: 'primary.main' }}>
            <Typography variant='h4' align="left" padding={2} >
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
                  <TableCell>Actions</TableCell>
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
                {sortedCustomers.map((customer) => {
                  const id = customer.links[0].href.split('/').pop();
                  return (
                    <TableRow key={customer.links[0].href}>
                      <TableCell>
                        <NewTraining
                          saveTraining={saveTraining}
                          customerLink={customer.links[0].href}
                        />
                        <IconButton
                          onClick={() => handleDelete(id)}
                          edge="end"
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                      {columns.map((column) => (
                        <EditableTableCell key={column.id} row={customer} column={column} />
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </>
  );
}

export default CustomerList;
