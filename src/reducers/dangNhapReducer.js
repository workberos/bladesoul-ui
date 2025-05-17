export const initialState = {
    username: '',
    password: '',
    secondaryPassword: '',
    showPassword: false,
    showSecondaryPassword: false,
    rememberMe: false,
    error: null,
    isSubmitting: false,
    isResetPasswordModalOpen: false,
    resetUsername: '',
    resetOTP: '',
    isOTPSent: false,
    isOTPVerified: false,
    newPassword: '',
    resetSecondaryPassword: '',
    confirmNewPassword: '',
    showNewPassword: false,
    showConfirmNewPassword: false,
    cooldown: 0,
    isSendingOTP: false,
};

export function reducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_ERROR':
            return { ...state, error: action.error };
        case 'SET_SUBMITTING':
            return { ...state, isSubmitting: action.value };
        case 'SET_OTP_SENT':
            return { ...state, isOTPSent: action.value };
        case 'SET_OTP_VERIFIED':
            return { ...state, isOTPVerified: action.value };
        case 'SET_RESET_MODAL':
            return { ...state, isResetPasswordModalOpen: action.value };
        case 'SET_COOLDOWN':
            return { ...state, cooldown: action.value };
        case 'SET_SENDING_OTP':
            return { ...state, isSendingOTP: action.value };
        case 'RESET_RESET_FORM':
            return {
                ...state,
                resetEmail: '',
                resetOTP: '',
                isOTPSent: false,
                isOTPVerified: false,
                newPassword: '',
                confirmNewPassword: '',
                showNewPassword: false,
                showConfirmNewPassword: false,
                captchaToken: null,
                cooldown: 0,
                error: null
            };
        default:
            return state;
    }
}

// Action creators for reducer
export const setField = (field, value) => ({ type: 'SET_FIELD', field, value });
export const setError = (error) => ({ type: 'SET_ERROR', error });
export const setSubmitting = (value) => ({ type: 'SET_SUBMITTING', value });
export const setOTPSent = (value) => ({ type: 'SET_OTP_SENT', value });
export const setOTPVerified = (value) => ({ type: 'SET_OTP_VERIFIED', value });
export const setResetModal = (value) => ({ type: 'SET_RESET_MODAL', value });
export const setCooldown = (value) => ({ type: 'SET_COOLDOWN', value });
export const setSendingOTP = (value) => ({ type: 'SET_SENDING_OTP', value });
export const resetResetForm = () => ({ type: 'RESET_RESET_FORM' });
