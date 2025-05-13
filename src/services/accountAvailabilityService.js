import BaseApi from './base-api';

class AccountAvailabilityService extends BaseApi {
    constructor() {
        super('/');
    }

    async checkAccountNameAvailability(accountName) {
        try {
            const response = await this.get('/check-availability', {
                params: { account_name: accountName },
            });
            return response.data.accountNameTaken;
        } catch (error) {
            console.error('Error checking account name availability:', error);
            throw error;
        }
    }

    async checkEmailAvailability(email) {
        try {
            const response = await this.get('/check-availability', {
                params: { email },
            });
            return response.data.emailTaken;
        } catch (error) {
            console.error('Error checking email availability:', error);
            throw error;
        }
    }
}

export default new AccountAvailabilityService();
