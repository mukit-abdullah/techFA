import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) {
      return setError('Please fill in all fields');
    }
    if (form.username.length < 3) {
      return setError('Username must be at least 3 characters long');
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError('Please enter a valid email address');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    
    try {
      setLoading(true);
      setError('');
      await api.post('/sign_up', form);
      alert('Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField fullWidth margin="normal" label="Username" name="username" value={form.username} onChange={handleChange} disabled={loading} helperText="At least 3 characters" />
        <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={form.email} onChange={handleChange} disabled={loading} />
        <TextField fullWidth margin="normal" label="Password" type="password" name="password" value={form.password} onChange={handleChange} disabled={loading} helperText="At least 6 characters" />
        <Button onClick={handleSubmit} variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Register'}
        </Button>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Button onClick={() => navigate('/login')} variant="text" disabled={loading}>Login</Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
