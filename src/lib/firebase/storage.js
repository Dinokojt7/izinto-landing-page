// src/lib/firebase/storage.js
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

// Upload file to storage
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return { url: downloadURL, error: null }
  } catch (error) {
    return { url: null, error: error.message }
  }
}

// Get file download URL
export const getFileURL = async (path) => {
  try {
    const url = await getDownloadURL(ref(storage, path))
    return { url, error: null }
  } catch (error) {
    return { url: null, error: error.message }
  }
}

// Delete file from storage
export const deleteFile = async (path) => {
  try {
    await deleteObject(ref(storage, path))
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}