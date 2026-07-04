import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' })
  }

  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // DEBUG: ye line temporarily rakho, terminal me dekho payload me kya aa raha hai
    console.log('JWT payload:', payload)

    req.user = payload
    return next()
  } catch (err) {
    console.error('JWT verify failed:', err.message)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}