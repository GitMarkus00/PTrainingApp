import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';

function NewTraining({ customerLink, saveTraining }) {
      const [open, setOpen] = useState(false);
      const [training, setTraining] = useState({
        date: '',
        duration: '',
        activity: '',
        customer: customerLink
      });
    
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const handleSave = () => {
        saveTraining(training);
        setOpen(false);
        setTraining({
          date: '',
          duration: '',
          activity: '',
          customer: customerLink 
        });
      };
    
      return (
        <>
          <Button variant="contained" onClick={handleClickOpen}>
            Add Training
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Training</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Date"
                type="datetime-local"
                fullWidth
                value={training.date}
                onChange={(e) => setTraining({...training, date: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Duration"
                type="number"
                fullWidth
                value={training.duration}
                onChange={(e) => setTraining({...training, duration: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Activity"
                fullWidth
                value={training.activity}
                onChange={(e) => setTraining({...training, activity: e.target.value})}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>
        </>
      );
    }
    

export default NewTraining;
