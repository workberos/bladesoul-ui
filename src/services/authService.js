import BaseApi from "./base-api";
import { setCookie } from "../utils/cookies";

class AuthService extends BaseApi {

    constructor() {
      super('/')    
    }

    async signin(identifier, password) {
         try {
            const response = await this.post('/signin', {
                identifier,
                signin_password: password,
            });
            // Lưu token vào cookie nếu có
            if (response.data && response.data.token) {
                setCookie('authToken', response.data.token, { path: '/' });
            }
            return response.data;
        } catch (error) {
            console.error('Error in signin:', error.message);
            throw error;
        }
    }

    async signup(accountName, email, password) {
        try {
            const response = await this.post('/signup', {
                email: email,
                userName: accountName,
                password: password,
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi:', error);
            throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
        }
    }

    async sendForgotPassword(email) {
        try {
            const response = await this.post('/forgot-password/send', { email });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể gửi yêu cầu khôi phục mật khẩu');
        }
    }

    async resetPassword(email, newPassword, captchaToken) {
        try {
            const response = await this.post('/forgot-password/reset', {
                email,
                newPassword,
                captchaToken
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
        }
    }
}

export default new AuthService();