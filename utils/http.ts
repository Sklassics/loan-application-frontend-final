import axios, { type AxiosError } from "axios"
import { getToken } from "./tokenUtils"
import { useAuthStore } from "@/store/auth"

// Create axios instance with default config
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds
})

// Request interceptor to add auth token to requests
http.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}` // for Spring Boot back-end, use Bearer token
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor to extract data and handle errors
http.interceptors.response.use(
  (response) => {
    // Return just the data from the response
    return response.data
  },
  (error: AxiosError) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status

      if (status === 401) {
        // Unauthorized - token expired or invalid
        // In a real app, you might want to redirect to login or refresh the token
        console.error("Authentication error: Token expired or invalid")
         useAuthStore.getState().logoutAction()
      }

      // Return the error data from the response
      // return Promise.reject(error.response.data)
      return error.response.data
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network error: No response received")
      // return Promise.reject({ message: "Network error: Unable to connect to server" })
      return error.request.data
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request error:", error.message)
      // return Promise.reject({ message: error.message })
      return error.message
    }
  },
)

export default http

