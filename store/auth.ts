import { IAuthState, IEmailOtpReq, IMobOtpReq, ISaveUserReq } from "@/interface/IAuthStore";
import { IResponse } from "@/interface/ICommonStore";
import http from "@/utils/http";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { removeToken, setToken } from "@/utils/tokenUtils";

const initialState = {
    token: null
}

export const useAuthStore = create<IAuthState>()(
    persist(
        (set, get) => ({
            ...initialState,

            sendMobileOtpAction: async (payload: { phoneNumber: string }) => {
                let mobPayload = { phoneNumber: get().getPhoneNumberPayload(payload.phoneNumber) };
                const response: IResponse<any> = await http.post('/mobile/send-otp', mobPayload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                return response;
            },

            verifyMobileOtpAction: async (payload: IMobOtpReq) => {
                let mobPayload = { phoneNumber: get().getPhoneNumberPayload(payload.phoneNumber), otp: payload.otp };
                const response: IResponse<any> = await http.post('/mobile/verify-otp', mobPayload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                if (response && response?.token) {
                    setToken(response.token);
                }
                return response;
            },

            sendEmailOtpAction: async (payload: { email: string }) => {
                const response: IResponse<any> = await http.post('/email/send-otp', payload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                return response;
            },

            verifyEmailOtpAction: async (payload: IEmailOtpReq) => {
                const response: IResponse<any> = await http.post('/email/verify-otp', payload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                if (response && response?.token) {
                    setToken(response.token);
                }
                return response;
            },

            saveUserAction: async (payload: ISaveUserReq) => {
                let updatedPayload = { mobileNo: get().getPhoneNumberPayload(payload.phoneNumber), email: payload.email };
                const response: IResponse<any> = await http.post('/api/save', updatedPayload, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                if (response && response?.token) {
                    setToken(response.token);
                }
                return response;
            },

            getPhoneNumberPayload: (number: string) => {
                return '+91' + number;
            },

            logoutAction: () => {
                set({ token: null });
                removeToken();
            },
        }),
        {
            name: 'auth',
            partialize: (state) => ({ token: state.token })
        }
    )
);
