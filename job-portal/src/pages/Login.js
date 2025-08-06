import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      return setError('Please fill in all fields');
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError('Please enter a valid email address');
    }
    
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/sign_in', form);
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={form.email} onChange={handleChange} disabled={loading} />
        <TextField fullWidth margin="normal" label="Password" type="password" name="password" value={form.password} onChange={handleChange} disabled={loading} />
        <Button onClick={handleSubmit} variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Login'}
        </Button>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Button onClick={() => navigate('/register')} variant="text" disabled={loading}>Register</Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
