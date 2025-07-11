import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import mockTasks from '../../../lib/mock_data';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ date: '', event: '', remark: '', pointOfPerson: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Load mock data on mount
  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  // Notification check (optional)
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      tasks.forEach((task, i) => {
        if (task.date === today && !task.notified) {
          showNotification(task);
          tasks[i].notified = true;
          setTasks([...tasks]);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const showNotification = (task) => {
    const message = `${task.event} is due today!`;
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Reminder', {
        body: message,
        icon: '/icons/icon-192x192.png',
      });
    } else {
      alert(message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.date || !form.event || !form.pointOfPerson) return;

    const updated = [...tasks];
    if (editingIndex !== null) {
      updated[editingIndex] = form;
    } else {
      updated.push(form);
    }

    setTasks(updated);
    setForm({ date: '', event: '', remark: '', pointOfPerson: '' });
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    setForm(tasks[index]);
    setEditingIndex(index);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>📝 Task Reminder</Typography>

      <Grid container spacing={2}>
        {/* Task List View */}
        <Grid item xs={12} md={6}>
          <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>📋 Task List</Typography>
            {tasks.length === 0 && (
              <Typography color="text.secondary">No tasks found.</Typography>
            )}
            {tasks.map((task, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Typography><strong>Date:</strong> {task.date}</Typography>
                <Typography><strong>Event:</strong> {task.event}</Typography>
                <Typography><strong>Remark:</strong> {task.remark}</Typography>
                <Typography><strong>Point of Person:</strong> {task.pointOfPerson}</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <IconButton onClick={() => handleEdit(index)} color="primary">
                    <EditIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>

        {/* Task Form */}
        <Grid item xs={12} md={6}>
          <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, bgcolor:'ffffff' }}>
            <Typography variant="h6" gutterBottom>
              {editingIndex !== null ? '✏️ Edit Task' : '➕ Add Task'}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Event"
                  name="event"
                  value={form.event}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Remark"
                  name="remark"
                  value={form.remark}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Point of Person"
                  name="pointOfPerson"
                  value={form.pointOfPerson}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth onClick={handleSubmit}>
                  {editingIndex !== null ? 'Update Task' : 'Add Task'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Task;
