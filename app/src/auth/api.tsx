import axios from 'axios'
import base_api from '../api'
import { ServerChallenge } from './types'

export async function checkEmailExists(email: string) {
    const response = await base_api.post("/auth/register/email", { email: email });
    return response.data.result;
}

export async function getChallenge(email: string): Promise<ServerChallenge> {
    const response = await base_api.post("/auth/challenge", { email })
    return response.data
}

export function getImageUrl(uid: string) {
    return base_api.defaults.baseURL + "image/" + uid
}

export async function registerUser(name: string, email: string, objects: { uid: string, name: string }[]) {
    const response: { name: string, email: string } = (await base_api.post(
        "/auth/register",
        {
            name,
            email,
            objects: objects.map((obj) => { return { uid: obj.uid } })
        })).data

    return response;
}

export async function signOut() {
    // need to pass a request to server to note sign-out time
}

export async function signIn(email: string, challengeUid: string, images: string[]) {
    try {
        const response = await axios.request({
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            url: "/auth/token",
            method: "post",
            baseURL: base_api.defaults.baseURL,
            data: `grant_type=password&username=${encodeURIComponent(email)}&password=${[challengeUid, ...images].join('-')}`
        });
        const token: string = response.data.access_token;
        return token;
    } catch (e) {
        throw Error(`Authentication failed`);
    }
}

export async function getUser() {
    const user: { email: string, name: string } = (await base_api.get("/user/info")).data;
    if (!user) { throw Error("Cannot retrieve credentials") };
    return user;
}

export async function getObjectsInfo() {
    const objects: { uid: string, name: string }[] = (await base_api.get("/object/all")).data.objects
    return objects
}

export function getObject(uid: string) {
    return base_api.defaults.baseURL + "object/" + uid
}

export default {
    checkEmailExists,
    getChallenge,
    getImageUrl,
    registerUser,
    signIn,
    getUser,
    getObjectsInfo,
    getObject,
}
