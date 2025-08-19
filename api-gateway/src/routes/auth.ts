import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, validateRequest, loginValidation, registerValidation } from '../middleware/validation';

const router = Router();

// Mock database - replace with actual database implementation
const users: any[] = [];
const saltRounds = 10;

// Register
router.post('/register', registerValidation, validateRequest, async (req, res) => {
  try {
    const { name, email, password, company } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      company: company || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Registration failed'
    });
  }
});

// Login
router.post('/login', loginValidation, validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Login failed'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === (req as any).user.id);
  if (!user) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'User not found'
    });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company,
    role: user.role,
    createdAt: user.createdAt
  });
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  // In a real implementation, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Refresh token
router.post('/refresh', authenticateToken, (req, res) => {
  const user = (req as any).user;
  
  // Generate new token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    token
  });
});

export default router;