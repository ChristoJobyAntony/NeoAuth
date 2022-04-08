import * as React from 'react';
import base_api, { setURLAccessToken } from '../../api';
import api from '../api';

// const USER_INFO_LOCAL_STORAGE = "user-info";
const ACCESS_TOKEN_LOCAL_STORAGE = "access-token"
interface User {
    name : string, 
    email : string
}

interface AuthContextType {
    user : User | null;
    token : string | null;
    signIn : (email:string, images: string[]) => Promise<void>;
    signOut : (callback:VoidFunction) => void;
}

interface props {
    children : React.ReactNode
}

// This context will be used to check the login status of the user.
let AuthContext = React.createContext<AuthContextType>(null!);

// A context provider, the components to use this AuthCOntext needs to be nested inside this.
export  function AuthProvider (props : props)  {
    let [token, setToken] = React.useState<string | null>(localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE));
    let [user, setUser] = React.useState<User | null>(null);

    if (token && !user) useToken(token);

    async function signIn (email : string, images : string []){
        const token = await api.signIn(email, images);
        await useToken(token);
    }
    
    async function useToken (token : string) {
        try {
            setURLAccessToken(token);
            const user_info = await api.getUser();
            setUser(user_info);
            setToken(token);
            localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE, token);
        }catch (e) {
            setUser(null);
            setToken(null);
            throw Error(`Couldn't set up token: ${e}`);
        }
    }

    function signOut () {
        setUser(null);
        setToken(null);
        localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE);
    }

    let value = {user, token, signIn, signOut}
    return(
        <AuthContext.Provider value = {value}> {props.children} </AuthContext.Provider>
    )
}

// A simple function to quickly get the AuthContext
export function useAuth () {
    return React.useContext(AuthContext)
}