import BaseApi from "./base-api";
import { setCookie } from "../utils/cookies";

class AuthService extends BaseApi {

    constructor() {
      super('/')    
    }

    async signin(username, password, secondaryPassword) {
         try {
            const response = await this.post('/signin', {
                username,
                realPassword: password,
                safePassword: secondaryPassword,
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

    async signup(accountName, email, password, secondaryPassword) {
        try {
            const response = await this.post('/signup', {
                email: email,
                userName: accountName,
                realPassword: password,
                safePassword: secondaryPassword,
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi:', error);
            throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
        }
    }

    async sendForgotPassword(username, safePassword) {
        try {
            const response = await this.post('/forgot-password/send', { username, safePassword });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể gửi yêu cầu khôi phục mật khẩu');
        }
    }

    async resetPassword(username, secondaryPassword, newPassword) {
        try {
            const response = await this.post('/forgot-password/reset', {
                username,
                safePassword: secondaryPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
        }
    }
}

export default new AuthService();