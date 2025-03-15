export interface ICreditState {
    getCreditLimitAction : () => void
    withdrawCreditAction : (payload : IWithdrawReq) => void
}

export interface IWithdrawReq{
    withdrawAmount : number
    tenure : string
    processingFee : number
    onboardingFee : number
    documentationFee : number
}