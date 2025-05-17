import BaseApi from "./base-api";
import { setCookie } from "../utils/cookies";

class AuthService extends BaseApi {

    constructor() {
      super('/')    
    }

    async signin(userName, password) {
         try {
            const response = await this.post('/signin', {
                userName,
                password,
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

    async signup(accountName, password, secondaryPassword) {
        try {
            const response = await this.post('/signup', {
                userName: accountName,
                password: password,
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