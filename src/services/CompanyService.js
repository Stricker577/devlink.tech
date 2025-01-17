import axios from 'axios';

/**
 * Creates a Company.
 *
 * @param {Object} data
 */
export const createCompany = (data) => {
    return axios.post('/companies/', data);
};

export const getCompany = (id) => {
    return axios.get(`/companies/${id}/`);
};
