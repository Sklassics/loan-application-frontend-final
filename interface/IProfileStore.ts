export interface IProfileState {
    profileState : any
    savePersonalDetailsAction : (payload : IProfileReq) => void
    sendPanOtpAction : (payload : any) => void
    verifyPanOtpAction : (payload : IPanReq) => void
    sendBankDetailsAction : (payload : IBankReq) => void
    verifyBankDetailsAction : (payload : IVerBankReq) => void
}

export interface IProfileReq{
    first_name : string
    last_name : string
    date_of_birth : string
    gender : string
    marital_status : string
    father_name : string
    address : string
    pincode : string
    country : string
    alternate_number : string
    employment_type : string
    annual_income : string | number
    company_id : string
    company_name : string
    company_address : string
}

export interface IPanReq{
    pancard : string
    otp : string
}

export interface IBankReq{
    fullName : string
    bankName : string
    address : string
    accountNumber : string
    mobileNumber : string
}

export interface IVerBankReq{
    mobileNumber : string
    otp : string
}

