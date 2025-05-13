import BaseApi from "./base-api";

class MailService extends BaseApi {
    constructor() {
        super("/");
    }

    async sendVerificationEmail(email) {
        try {
            const response = await this.post("/send-verification", { email });
            return response.data;
        } catch (error) {
            console.error("Error sending verification email:", error);
            throw error;
        }
    }

    async verifyCode(email, code) {
        try {
            const response = await this.post("/verify-code", { email, code });
            return response.data;
        } catch (error) {
            console.error("Error verifying code:", error);
            throw error;
        }
    }

    async sendChangeEmailOTP(email) {
        try {
            const response = await this.post("/send-verification", { email, action: "change-email" });
            return response.data;
        } catch (error) {
            console.error("Error sending change email OTP:", error);
            throw error;
        }
    }
}

export default new MailService();
