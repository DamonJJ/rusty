// Simple authentication utilities for admin access
// In production, you'd want to use a proper authentication service

export interface AdminSession {
  isAuthenticated: boolean
  timestamp: number
}

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const SESSION_KEY = 'admin-session'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rusty2024!' // Default for development

export function authenticateAdmin(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function createSession(): AdminSession {
  const session: AdminSession = {
    isAuthenticated: true,
    timestamp: Date.now()
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
  
  return session
}

export function getSession(): AdminSession | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) {
      return null
    }
    
    const session: AdminSession = JSON.parse(sessionData)
    
    // Check if session has expired
    if (Date.now() - session.timestamp > SESSION_DURATION) {
      clearSession()
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error reading session:', error)
    clearSession()
    return null
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function isAuthenticated(): boolean {
  const session = getSession()
  return session?.isAuthenticated || false
}
