import { IResponse } from "./ICommonStore"

export interface ICreditState {
    getCreditLimitAction : () => Promise<IResponse<any>>
    withdrawCreditAction : (payload : IWithdrawReq) => void
}

export interface IWithdrawReq{
    withdrawAmount : number
    tenure : string
    processingFee : number
    onboardingFee : number
    documentationFee : number
}