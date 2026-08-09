import axios from 'axios'

// Generous timeout: requesting a challenge can trigger on-demand image-set
// generation on the server, which takes several seconds.
const base_api = axios.create({
    baseURL: '/api/',
    timeout: 30000,
    timeoutErrorMessage: "Network Error"
})

export function setURLAccessToken (token : string) {
    base_api.defaults.headers.common = {'Authorization': `Bearer ${token}`}
}
export default base_api
