import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'

const jwtSecret = process.env.JWT_SECRET
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d'

if (!jwtSecret) {
  throw new Error('Missing JWT_SECRET in backend environment')
}

export async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields (name, email, password, confirm password) are required' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    const { data, error } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { 
        name: name.trim(),
        full_name: name.trim()
      },
    })

    if (error) {
      if (error.message?.toLowerCase().includes('already')) {
        return res.status(409).json({ message: 'User already exists with this email' })
      }
      return res.status(500).json({ message: error.message })
    }

    const createdUser = data.user

    if (!createdUser) {
      return res.status(500).json({ message: 'Failed to create user' })
    }

    const token = jwt.sign(
      { sub: createdUser.id, email: normalizedEmail },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    )

    return res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.user_metadata?.name || createdUser.user_metadata?.full_name || createdUser.user_metadata?.displayName || '',
        created_at: createdUser.created_at,
      },
    })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (error) {
      if (error.message?.toLowerCase().includes('invalid login credentials')) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      return res.status(500).json({ message: error.message })
    }

    if (!data.user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { sub: data.user.id, email: data.user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    )

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.user_metadata?.displayName || '',
        created_at: data.user.created_at,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function logout(req, res) {
  try {
    // Statless JWT logout can just return success, client handles token clearance.
    return res.json({ message: 'Logout successful' })
  } catch (err) {
    console.error('Logout error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getProfile(req, res) {
  try {
    const { sub: userId } = req.user

    const { data, error } = await supabase.auth.admin.getUserById(userId)

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    if (!data.user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.user_metadata?.displayName || '',
        created_at: data.user.created_at,
      },
    })
  } catch (err) {
    console.error('Get profile error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function updateProfile(req, res) {
  try {
    const { sub: userId } = req.user
    const { name, password, portfolio } = req.body

    const updateData = {}

    // First fetch existing user metadata to merge
    const { data: userResponse, error: getUserError } = await supabase.auth.admin.getUserById(userId)
    if (getUserError || !userResponse.user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const existingMetadata = userResponse.user.user_metadata || {}

    if (name !== undefined || portfolio !== undefined) {
      updateData.user_metadata = { ...existingMetadata }
      if (name !== undefined) {
        updateData.user_metadata.name = name.trim()
        updateData.user_metadata.full_name = name.trim()
      }
      if (portfolio !== undefined) {
        updateData.user_metadata.portfolio = portfolio
      }
    }

    if (password !== undefined && password !== '') {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' })
      }
      updateData.password = password
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' })
    }

    const { data, error } = await supabase.auth.admin.updateUserById(userId, updateData)

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.user_metadata?.displayName || '',
        created_at: data.user.created_at,
        portfolio: data.user.user_metadata?.portfolio || null,
      },
    })
  } catch (err) {
    console.error('Update profile error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getPublicPortfolio(req, res) {
  try {
    const { userId } = req.params

    const { data, error } = await supabase.auth.admin.getUserById(userId)

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    if (!data.user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.user_metadata?.displayName || '',
        created_at: data.user.created_at,
        portfolio: data.user.user_metadata?.portfolio || null,
      },
    })
  } catch (err) {
    console.error('Get public portfolio error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
