const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let users = [];
let jobs = [];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User Registration
app.post('/api/sign_up', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/sign_in', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all jobs
app.get('/api/jobs', authenticateToken, (req, res) => {
  try {
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new job
app.post('/api/jobs', authenticateToken, (req, res) => {
  try {
    const { title, company, description, location, salary, category } = req.body;

    // Validation
    if (!title || !company || !description || !location) {
      return res.status(400).json({ error: 'Title, company, description, and location are required' });
    }

    const job = {
      id: uuidv4(),
      title,
      company,
      description,
      location,
      salary: salary || null,
      category: category || null,
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    jobs.push(job);

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update job
app.put('/api/jobs/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, description, location, salary, category } = req.body;

    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user owns the job (optional - remove if any user can edit any job)
    if (jobs[jobIndex].createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this job' });
    }

    // Update job
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      title: title || jobs[jobIndex].title,
      company: company || jobs[jobIndex].company,
      description: description || jobs[jobIndex].description,
      location: location || jobs[jobIndex].location,
      salary: salary !== undefined ? salary : jobs[jobIndex].salary,
      category: category !== undefined ? category : jobs[jobIndex].category,
      updatedAt: new Date()
    };

    res.json({
      message: 'Job updated successfully',
      job: jobs[jobIndex]
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete job
app.delete('/api/jobs/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user owns the job (optional - remove if any user can delete any job)
    if (jobs[jobIndex].createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    jobs.splice(jobIndex, 1);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Job Portal API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Job Portal API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
