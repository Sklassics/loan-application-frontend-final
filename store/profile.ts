import { IResponse } from "@/interface/ICommonStore";
import { IBankReq, IPanReq, IProfileReq, IProfileState, IVerBankReq } from "@/interface/IProfileStore";
import http from "@/utils/http";
import { create } from "zustand";
import { persist } from "zustand/middleware"

const initialState = {
    profileState : null
}

export const useProfileStore = create<IProfileState>()(
    persist(
        (set)=>({
            ...initialState,
            savePersonalDetailsAction : async (payload : any) => {
                const response: IResponse<any> = await http.post('/api/save-personal-details', payload)
                return response
            },
            sendPanOtpAction : async (payload : any) => {
                const response: IResponse<any> = await http.post('/api/pancard/sendOtp', payload)
                return response
            },
            verifyPanOtpAction : async (payload : IPanReq) => {
                const response: IResponse<any> = await http.post('/api/pancard/create', payload)
                return response
            },
            sendBankDetailsAction : async (payload : IBankReq) => {
                const response: IResponse<any> = await http.post('/api/bank-details/send-otp', payload)
                return response
            },
            verifyBankDetailsAction : async (payload : IVerBankReq) => {
                const response: IResponse<any> = await http.post('/api/bank-details/verify-otp', payload)
                return response
            },
            uploadProfileImageAction : async (payload : any) => {
                const formData = new FormData()
                formData.append('selfie_image', payload)

                const response: IResponse<any> = await http.post('/selfie/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                return response
            }
        }),
        {
            name: 'profile',
            partialize: (state) => ({ profile: state.profileState })
        }
    )
)