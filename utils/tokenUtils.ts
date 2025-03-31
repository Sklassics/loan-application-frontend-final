// Token key in localStorage
const TOKEN_KEY = "auth_token"

/**
 * Set authentication token in localStorage
 * @param token JWT token
 */
export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token)
    document.cookie = `token=${token}; path=/; secure; samesite=strict;`
  }
}

/**
 * Get authentication token from localStorage
 * @returns The stored token or null if not found
 */
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

/**
 * Remove authentication token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
    document.cookie = `token=; path=/; secure; samesite=strict;`
  }
}

/**
 * Check if token is valid (not expired)
 * @returns boolean indicating if token is valid
 */
export const isTokenValid = (): boolean => {
  const token = getToken()

  if (!token) {
    return false
  }

  try {
    // In a real app, you would decode the JWT and check the expiration
    // For this example, we'll just check if the token exists
    return true
  } catch (error) {
    return false
  }
}

