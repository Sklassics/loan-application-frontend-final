export interface IAuthState{
    token: string | null,
    sendMobileOtpAction : (payload : {phoneNumber : string}) => void
    verifyMobileOtpAction : (payload : IMobOtpReq) => void
    sendEmailOtpAction : (payload : {email : string}) => void
    verifyEmailOtpAction : (payload : IEmailOtpReq) => void
    saveUserAction : (payload : ISaveUserReq) => void
    logoutAction : () => void
    getPhoneNumberPayload : (number : string) => string
}

export interface IMobOtpReq{
    phoneNumber : string
    otp : string
}

export interface IEmailOtpReq{
    email : string
    otp : string
}

export interface ISaveUserReq{
    phoneNumber : string
    email : string
}