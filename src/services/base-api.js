import axiosInstance from "../utils/axiosInstance";

class BaseApi {

    constructor(baseEndpoint = '') {
        this.baseEndpoint = baseEndpoint;
    }

    createUrl(endpoint='') {
        return `${this.baseEndpoint}${endpoint}`;
    }

    async get(endpoint='', params={}, config={}) {
        try {
            return await axiosInstance.get(this.createUrl(endpoint), {
                params,
                ...config
            })
        } catch (error) {
            throw error;
        }
    }

    async post(endpoint='', data={}, config={}) {
        try {
            return await axiosInstance.post(this.createUrl(endpoint), data, config);
        } catch (error) {
            throw error;
        }
    }

    async put(endpoint='', data={}, config={}) {
        try {
            return await axiosInstance.put(this.createUrl(endpoint), data, config);
        } catch (error) {
            throw error;
        }
    }

    async delete(endpoint='', data={}, config={}) {
        try {
            return await axiosInstance.delete(this.createUrl(endpoint), {
                data,
                ...config
            });
        } catch (error) {
            throw error;
        }
    }
}

export default BaseApi;