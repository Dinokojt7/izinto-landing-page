// src/lib/firebase/auth.js
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth'
import { auth } from './config'

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

// Create new user with email and password
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, { displayName })
    }
    
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

// Sign out
export const logout = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Password reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Auth state observer
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser
}