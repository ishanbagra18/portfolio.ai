import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'
import nodemailer from 'nodemailer'

// In-memory store for 2FA (In a real app, use Redis or a DB table)
const pendingLogins = new Map();

// Helper to get a nodemailer test account and transport
let testAccount = null;
let transporter = null;
async function getMailTransporter() {
  if (!transporter) {
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    } else {
      testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
  }
  return transporter;
}

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
      const msg = error.message?.toLowerCase() || ''
      if (msg.includes('already')) {
        return res.status(409).json({ message: 'User already exists with this email' })
      }
      if (msg.includes('fetch failed') || msg.includes('enotfound')) {
        return res.status(500).json({ message: 'Database connection failed: Could not reach Supabase. Please verify your SUPABASE_URL in backend/.env' })
      }
      return res.status(400).json({ message: error.message })
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
      const msg = error.message?.toLowerCase() || ''
      if (msg.includes('invalid') || msg.includes('credentials') || msg.includes('user not found')) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      if (msg.includes('fetch failed') || msg.includes('enotfound')) {
        return res.status(500).json({ message: 'Database connection failed: Could not reach Supabase. Please verify your SUPABASE_URL in backend/.env' })
      }
      return res.status(400).json({ message: error.message })
    }

    if (!data.user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { sub: data.user.id, email: data.user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    )

    // Only require 2FA if explicitly enabled in environment AND SMTP is configured
    const is2FAEnabled = process.env.ENABLE_2FA === 'true' && Boolean(process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD);

    if (!is2FAEnabled) {
      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.user_metadata?.displayName || '',
          created_at: data.user.created_at,
        },
      });
    }

    // 2FA OTP flow (when ENABLE_2FA=true)
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    
    pendingLogins.set(normalizedEmail, {
      otp,
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.user_metadata?.displayName || '',
        created_at: data.user.created_at,
      },
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    try {
      const mailer = await getMailTransporter();
      const emailHtml = `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #111113; color: #ffffff; border-radius: 16px; border: 1px solid #27272a;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; color: #f472b6;">Portfolio.io</h1>
          </div>
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #ffffff;">Authentication Required</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #a1a1aa; margin-bottom: 32px;">You recently attempted to log in to your account. To complete the login process, please use the 6-digit authentication code below. This code will expire in 10 minutes.</p>
          <div style="background-color: #18181b; padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #27272a; margin-bottom: 32px;">
            <span style="font-family: monospace; font-size: 42px; font-weight: 700; letter-spacing: 8px; color: #f472b6;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #71717a; text-align: center;">If you didn't request this email, you can safely ignore it.</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center; font-size: 12px; color: #52525b;">
            &copy; ${new Date().getFullYear()} Portfolio.io. All rights reserved.
          </div>
        </div>
      `;

      const info = await mailer.sendMail({
        from: '"Portfolio.io Security" <security@portfolio.io>',
        to: normalizedEmail,
        subject: "Your Two-Factor Authentication Code",
        text: `Your login code is: ${otp}`,
        html: emailHtml
      });
      
      if (!process.env.SMTP_EMAIL) {
        console.log("------------------------------------------");
        console.log("2FA OTP Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("------------------------------------------");
      }
    } catch (mailErr) {
      console.error("Failed to send 2FA email", mailErr.message);
      console.log("\n==========================================");
      console.log("⚠️ EMAIL FAILED - DEVELOPMENT FALLBACK ⚠️");
      console.log(`Your 6-digit OTP code is: ${otp}`);
      console.log("==========================================\n");
    }

    return res.json({
      message: '2FA required. Please check your email for the OTP.',
      requires2FA: true,
      email: normalizedEmail
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: err.message || 'Internal server error' })
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const pending = pendingLogins.get(normalizedEmail);

    if (!pending) {
      return res.status(400).json({ message: 'No pending login found. Please log in again.' });
    }

    if (Date.now() > pending.expiresAt) {
      pendingLogins.delete(normalizedEmail);
      return res.status(400).json({ message: 'OTP has expired. Please log in again.' });
    }

    if (pending.otp !== String(otp).trim()) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Success! Clear the pending login and return the token
    pendingLogins.delete(normalizedEmail);

    return res.json({
      message: 'Login successful',
      token: pending.token,
      user: pending.user
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ message: 'Internal server error' });
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


