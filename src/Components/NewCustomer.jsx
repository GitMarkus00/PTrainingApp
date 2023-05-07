import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function NewCustomer({ saveCustomer }) {
      const [open, setOpen] = useState(false);
      const [customer, setCustomer] = useState({
            firstname: "",
            lastname: "",
            streetaddress: "",
            postcode: "",
            city: "",
            email: "",
            phone: ""
      });

      const handleChangeInput = event => {
            setCustomer({ ...customer, [event.target.id]: event.target.value });
      };

      const handleClickOpen = () => {
            setOpen(true);
      };

      const handleClose = () => {
            setOpen(false);
      };

      const handleSave = () => {
            saveCustomer(customer);
            setOpen(false);
      };

      return (
            <div>
                  <Button variant="outlined" onClick={handleClickOpen} sx={{ position: 'absolute', bottom: '-50px', left: '16px' }}>
                        Add Customer
                  </Button>

                  <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Add a Customer</DialogTitle>
                        <DialogContent>
                              <DialogContentText>
                                    Add a new customer to the database.
                              </DialogContentText>
                              <TextField
                                    autoFocus
                                    margin="dense"
                                    id="firstname"
                                    label="First Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={event => handleChangeInput(event)}
                                    value={customer.firstname}
                              />
                              <TextField
                                    margin="dense"
                                    id="lastname"
                                    label="Last Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={event => handleChangeInput(event)}
                                    value={customer.lastname}
                              />
                              <TextField
                                    margin="dense"
                                    id="streetaddress"
                                    label="Street Address"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={event => handleChangeInput(event)}
                                    value={customer.streetaddress}
                              />
                              <TextField
                                    margin="dense"
                                    id="postcode"
                                    label="Postcode"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={event => handleChangeInput(event)}
                                    value={customer.postcode}
                              />
                              <TextField
                                    margin="dense"
                                    id="city"
                                    label="City"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={event => handleChangeInput(event)}
                                    value={customer.city}
                              />
                              <TextField
                                    margin="dense"
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                    variant="standard"
                                    onChange={event => handleChangeInput(event)}
                                    value={customer.email}
                              />
                              <TextField
                                    margin="dense"
                                    id="phone"
                                    label="Phone Number"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={event => handleChangeInput(event)}
                                    value={customer.phone}
                              />
                        </DialogContent>
                        <DialogActions>
                              <Button onClick={handleClose}>Cancel</Button>
                              <Button onClick={handleSave}>Save</Button>
                        </DialogActions>
                  </Dialog>
            </div>
      );
}

export default NewCustomer;
