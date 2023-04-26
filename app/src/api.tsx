import axios from 'axios'

const base_api = axios.create({
    baseURL: '/api/',
    timeout: 5000,
    timeoutErrorMessage: "Network Error"
})

export function setURLAccessToken (token : string) {
    base_api.defaults.headers.common = {'Authorization': `Bearer ${token}`}
}
export default base_api
