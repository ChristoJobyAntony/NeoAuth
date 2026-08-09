import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box, Grid } from "@mui/material";

import Register from "./register/Register";
import Login from "./login/Login";

const Auth = () => {

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: "background.default",
                overflow: "hidden",
            }}>
            <Grid
                container
                justifyContent="center"
                sx={{
                    height: { xs: "94%", md: "88%" },
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                }}>
                <Grid
                    item
                    xs={12}
                    sm={10}
                    md={7}
                    lg={6}
                    maxHeight="100%"
                >
                    <Routes>
                        <Route index element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Routes>
                </Grid>
            </Grid>
        </Box>

    )

}

export default Auth;
