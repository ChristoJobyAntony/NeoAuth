import axios from 'axios'

const base_api = axios.create({
    baseURL: 'http://christojobfyantony.zapto.org:5000/neoauth/',
    timeout: 5000,
    timeoutErrorMessage: "Network Error"
})

export default base_api
