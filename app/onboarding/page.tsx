
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Stepper, Step } from "@/components/stepper"
import PersonalInfoForm from "@/components/onboarding/personal-info-form"
import AddressForm from "@/components/onboarding/address-form"
import EmploymentForm from "@/components/onboarding/employment-form"
import { CheckCircle2 } from "lucide-react"
import { FileUploader } from "@/components/kyc/file-uploader"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useProfileStore } from "@/store/profile"
import { toast } from "react-toastify"
import axios from "axios"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    personalInfo: null,
    addressInfo: null,
    employmentInfo: null,
    userImage: null as File | null,
  })
  const [isComplete, setIsComplete] = useState(false)
  const [userImage, setUserImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const handleNext = async (data: any, idImage?: File) => {
    if (step === 1) {
      setFormData((prev) => ({ ...prev, personalInfo: data, userImage }));
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      setFormData((prev) => ({ ...prev, addressInfo: data }));
      setStep(3);
      window.scrollTo(0, 0);
    } else if (step === 3) {
      setFormData((prev) => ({ ...prev, employmentInfo: data }));
  
      // Transform form data
      let transformedData = transformFormData({ ...formData });
      let empData = null;
      const formDataObj = new FormData();
  
      if (data?.employmentType === "employee") {
        formDataObj.append("employee_id_card", idImage || "");
        empData = transformEmpData(data);
      } else if (data?.employmentType === "student") {
        formDataObj.append("student_id_card", idImage || "");
        empData = transformStudentData(data);
      }

      const finaldata:any = {...transformedData, ...empData}
      
      formDataObj.append("data", JSON.stringify(finaldata));  
  
      try {
        const token = localStorage.getItem("auth_token");
        const response : any = await axios.post(
          "https://loanapp-x5qm.onrender.com/api/save-personal-details",
          formDataObj,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // const response: any = await saveDetails(formDataObj);
        if (response?.status === 200) {
          setIsComplete(true);
        } else {
          toast.error(response?.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit the form.");
      }
    }
  };

  function transformFormData(formData : any) {
    const transformedData = {
      first_name: formData.personalInfo.firstName,
      last_name: formData.personalInfo.lastName,
      date_of_birth: formData.personalInfo.dateOfBirth ? new Date(formData.personalInfo.dateOfBirth).toISOString().split('T')[0].split('-').reverse().join('-') : null,
      gender: formData.personalInfo.gender.charAt(0).toUpperCase() + formData.personalInfo.gender.slice(1),
      marital_status: formData.personalInfo.maritalStatus.charAt(0).toUpperCase() + formData.personalInfo.maritalStatus.slice(1),
      father_name: formData.personalInfo.fatherName,
      address: formData.addressInfo.address + ', ' + formData.addressInfo.city + ', ' + formData.addressInfo.state + ' - ' + formData.addressInfo.pincode,
      pincode: formData.addressInfo.pincode,
      country : 'India',
      alternate_number: formData.addressInfo.alternatePhone,
    };
    return transformedData;
  }


  function transformStudentData( formData : any ){
    const data = {
      employment_type: formData.employmentType,
      student_id: formData.studentId,
      student_address: formData.campusAddress,
      annual_income: parseInt(formData.annualIncome),
    };
    return data
  }

  function transformEmpData(formData : any){
    const data = {
      employment_type: formData.employmentType,
      company_id: formData.employeeId,
      company_address: formData.officeAddress,
      annual_income: parseInt(formData.annualIncome),
    }
    return data
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleUserImageUpload = (file: File) => {
    setUserImage(file)
    setImageError(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { when: "afterChildren" },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Please provide your details to personalize your experience</p>
        </motion.div>

        <div className="mb-12">
          <Stepper currentStep={step} className="max-w-2xl mx-auto">
            <Step title="Personal Info" />
            <Step title="Address" />
            <Step title="Employment" />
          </Stepper>
        </div>

        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center max-w-md mx-auto"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Profile Complete!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Thank you for providing your information. Your profile has been successfully created.
              </p>
              <Button
                className="bg-violet-150"
                onClick={() => (window.location.href = "/kyc-verification")}
              >
                KYC Verification
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
            >
              {step === 1 && (
                <>
                  {/* <div className="mb-8">
                    <Label className="block mb-2">Profile Image</Label>
                    <FileUploader
                      onFileUpload={handleUserImageUpload}
                      acceptedFileTypes={["image/jpeg", "image/png"]}
                      maxSize={5 * 1024 * 1024} // 5MB
                      label="Upload Profile Image"
                      description="Upload a clear photo of yourself"
                      icon="user"
                    />
                    {imageError && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{imageError}</AlertDescription>
                      </Alert>
                    )}
                  </div> */}
                  <PersonalInfoForm onSubmit={handleNext} />
                </>
              )}
              {step === 2 && (
                <AddressForm onSubmit={handleNext} onBack={handleBack} initialData={formData.addressInfo} />
              )}
              {step === 3 && (
                <EmploymentForm onSubmit={handleNext} onBack={handleBack} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

