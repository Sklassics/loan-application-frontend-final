import { IResponse } from "@/interface/ICommonStore";
import { IBankReq, IProfileState, IVerBankReq } from "@/interface/IProfileStore";
import http from "@/utils/http";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
    profileState: null
};

export const useProfileStore = create<IProfileState>()(
    persist(
        (set) => ({
            ...initialState,

            savePersonalDetailsAction: async (payload: any) => {
                const response: IResponse<any> = await http.post('/api/save-personal-details', payload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                return response;
            },

            sendPanOtpAction: async (payload: any) => {
                const response: IResponse<any> = await http.post('/api/pancard/sendOtp', payload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                return response;
            },

            verifyPanOtpAction: async (payload: any) => {
                const response: IResponse<any> = await http.post('/api/pancard/create', payload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                return response;
            },

            sendBankDetailsAction: async (payload: IBankReq) => {
                const response: IResponse<any> = await http.post('/api/bank-details/send-otp', payload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                return response;
            },

            verifyBankDetailsAction: async (payload: IVerBankReq) => {
                const response: IResponse<any> = await http.post('/api/bank-details/verify-otp', payload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                return response;
            },

            uploadProfileImageAction: async (payload: any) => {
                const formData = new FormData();
                formData.append('selfie_image', payload);

                const response: IResponse<any> = await http.post('/selfie/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                return response;
            },

            getProfileAction: async () => {
                const response: IResponse<any> = await http.get('/api/profile', {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });

                if (response?.status === 200 && response?.data) {
                    set({ profileState: response.data });
                }

                return response;
            }
        }),
        {
            name: 'profile',
            partialize: (state) => ({ profile: state.profileState })
        }
    )
);
