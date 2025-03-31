// Mock API functions for KYC verification

/**
 * Verify KYC information with a mock API
 * @param formData Form data containing KYC information
 * @returns Promise with verification result
 */
export const verifyKyc = async (formData: FormData): Promise<{ success: boolean; message?: string; status: number }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
  
    // Extract PAN number for validation
    const panNumber = formData.get("panNumber") as string
  
    // Validate PAN format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    const isValidPan = panRegex.test(panNumber)
  
    if (!isValidPan) {
      return {
        success: false,
        status: 400,
        message: "Invalid PAN format. Please check and try again.",
      }
    }
  
    // In a real app, you would make an actual API call to a KYC service
    // For demo purposes, we'll simulate a successful response
    return {
      success: true,
      status: 200,
      message: "KYC verification successful",
    }
  }
  
  /**
   * Verify OTP for KYC verification
   * @param otp OTP entered by the user
   * @returns Promise with verification result
   */
  export const verifyOtp = async (otp: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
  
    // For demo purposes, any 6-digit OTP is valid
    const isValidOtp = /^\d{6}$/.test(otp)
  
    if (!isValidOtp) {
      return {
        success: false,
        message: "Invalid OTP format. Please enter a 6-digit number.",
      }
    }
  
    // In a real app, you would validate against an actual OTP
    // For demo purposes, we'll simulate a successful response
    return {
      success: true,
      message: "OTP verification successful",
    }
  }
  
  /**
   * Check eligibility after KYC verification
   * @returns Promise with eligibility result
   */
  export const checkEligibility = async (): Promise<{ eligible: boolean; message?: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
  
    // In a real app, this would be an actual API call
    // For demo purposes, we'll simulate a successful response
    return {
      eligible: true,
      message: "You are eligible for our services",
    }
  }
  
  