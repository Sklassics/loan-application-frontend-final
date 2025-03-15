import { IResponse } from "@/interface/ICommonStore";
import { ICreditState, IWithdrawReq } from "@/interface/ICreditStore";
import http from "@/utils/http";
import { create } from "zustand";

export const useCreditStore = create<ICreditState>(() => ({
    getCreditLimitAction: async () => {
        const response: IResponse<any> = await http.get('/api/credit-limit')
        return response
    },

    withdrawCreditAction: async (payload: IWithdrawReq) => {
        const response: IResponse<any> = await http.post('/api/credit-limit/withdraw', payload)
        return response
    }
}))
