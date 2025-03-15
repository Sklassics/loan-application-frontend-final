// Mock API functions for bank account verification

interface BankVerificationData {
    fullName: string
    bankName: string
    address: string
    accountNumber: string
    ifscCode: string
    mobileNumber: string
    accountType: string
  }
  
  /**
   * Verify bank account information with a mock API
   * @param data Bank account data for verification
   * @returns Promise with verification result
   */
  export const verifyBankAccount = async (
    data: BankVerificationData,
  ): Promise<{ success: boolean; message?: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
  
    // Validate account number format (simple check for demo)
    if (!/^\d+$/.test(data.accountNumber)) {
      return {
        success: false,
        message: "Invalid account number format. Please enter only digits.",
      }
    }
  
    // Validate IFSC code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
    if (!ifscRegex.test(data.ifscCode)) {
      return {
        success: false,
        message: "Invalid IFSC code format. Please check and try again.",
      }
    }
  
    // In a real app, you would make an actual API call to a bank verification service
    // For demo purposes, we'll simulate a successful response
    return {
      success: true,
      message: "Bank account verification successful",
    }
  }
  
  