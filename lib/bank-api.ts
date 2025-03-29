// Mock API functions for bank account verification

interface BankVerificationData {
  fullName: string
  bankName: string
  accountNumber: string
  ifscCode: string
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

/**
 * Verify OTP for bank verification
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


  
async function sendOtp(values: {
  fullName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: "savings" | "current" | "salary";
  mobileNumber: string;
  address: string;
}) {
  try {
    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to send OTP",
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "OTP sent successfully",
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      success: false,
      message: "An error occurred while sending OTP. Please try again.",
    };
  }
}
// Removed duplicate sendOtp function definition


  