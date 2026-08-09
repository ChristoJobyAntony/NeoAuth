import React from "react";
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from 'notistack';

import '@fontsource/ibm-plex-serif/400.css';
import '@fontsource/ibm-plex-serif/500.css';
import '@fontsource/ibm-plex-serif/600.css';
import '@fontsource/ibm-plex-serif/700.css';

import theme from "./theme";
import Auth from "./auth/Auth";
import { AuthProvider } from "./auth/components/AuthProvider";
import { NavBar } from "./components/NavBar";
import Landing from "./Landing"
import Dash from "./dash/Dash";
import RequireAuth from "./auth/components/RequireAuth";

const App = () => {
    return (
        <BrowserRouter basename="/">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <SnackbarProvider autoHideDuration={2500}>
                        <NavBar />
                        <Routes>
                            <Route index element={<Landing />} />
                            <Route path="auth/*" element={<Auth />} />
                            <Route
                                path="dash/*"
                                element={
                                    <RequireAuth>
                                        <Dash />
                                    </RequireAuth>
                                } />
                        </Routes>
                    </SnackbarProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
};

export default App;
