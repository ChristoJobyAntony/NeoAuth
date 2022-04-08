import React from "react";
import { Route, Routes } from "react-router-dom";
import  Register from "./register/Register";
import Login from "./login/Login";
import {Box, Grid} from "@mui/material";
import { height } from "@mui/system";

type props = {
    rows : number,
    columns : number
}

const Auth = (props : props) => {
    
    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor:"primary.light",
                overflow: "hidden",
            }}>
                <Grid 
                container 
                justifyContent="center" 
                sx={{
                    height:"80%", 
                    width:"100%",
                    paddingLeft: "20px",
                    paddingRight: "20px"
                }}>
                <Grid 
                    item 
                    xs={12} 
                    md={6} 
                    maxHeight="100%"
                >
                    <Routes>
                        <Route index  element={<Login/>}/>
                        <Route path="register" element={<Register/>}/>
                    </Routes>
                </Grid>
            </Grid>
        </Box>

    )

}

export default Auth;