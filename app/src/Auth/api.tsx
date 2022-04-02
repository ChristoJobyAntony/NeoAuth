import axios from 'axios'
import base_api from '../api'

type authImage = {
    uid : string,
}


export async function checkEmailExists (email : string)  {
    const response = await base_api.post("/auth/register/email", {email : email} );
    console.log(response.data);
    return response.data.result;
}

export async function  getImageSet (email:string , exclude : string[]) {
    try {
        const exclude_uid = exclude.map( (uid) => {return {uid : uid} } )
        const data = { user : {email : email}, exclude :exclude_uid}
        const response = await base_api.post("/image/set", data)
        return response.data
    } catch(e) {
        console.log(`Request Failed : ${e}`);
        
    }
}

export function getImageUrl (uid : string) {
    return base_api.defaults.baseURL + "/image/" + uid
}

export async function registerUser (name : string, email : string, objects : {uid : string, name: string} [] ) {
    const response : {name : string, email : string} = (await base_api.post(
        "/auth/register",
        {
           name,
           email,
           objects : objects.map((obj) => {return {uid : obj.uid}}) 
        })).data
        
    return response;
}

export async function loginUser (email : string, images : string[]) {
    try {
        const data = {
            email : email,
            images : images.map((uid) => {return {uid : uid}})
        }
        console.log(data);
        console.log(images);
        console.log(data.images);
        
        const response = await base_api.post("/auth/login", data);
        console.log(response.data);
        
        return response.data.message
    }catch(e) {
        console.log("authentication error");
        return false
        
    }
}

export async function authUser (email : string, images : string[]) {
    try {
        const data = {
            email : email,
            images : images.map((uid) => {return {uid : uid}})
        }
        console.log(data);
        console.log(images);
        console.log(data.images);
        
        const response = await axios.request({
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            url: "/auth/token",
            method: "post",
            baseURL: base_api.defaults.baseURL,
            data: `grant_type=password&username=${email}&password=${images.join('-')}`
        })
        console.log(response.data);
        base_api.defaults.headers.common = {'Authorization': `Bearer ${response.data.access_token}`}
        getUser()
        return true
    }catch(e) {
        console.log("authentication error");
        return false
        
    }
}

export async function getUser () {
    console.log(await base_api.get("/user/info"));
    
}

export async function getObjectsInfo () {
    const objects : {uid : string, name : string} [] = (await base_api.get("/object/all")).data.objects
    return objects
}

export function getObject (uid : string) {
    return base_api.defaults.baseURL + "/object/" + uid
}

export default {
    checkEmailExists,
    getImageSet,
    getImageUrl,
    loginUser,
    registerUser,
    authUser,
    getUser,
    getObjectsInfo,
    getObject,
}

