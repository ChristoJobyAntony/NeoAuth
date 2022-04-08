import React from "react";
import {deepPurple, deepOrange, purple} from '@mui/material/colors';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from 'notistack';

import Auth from "./auth/Auth";
import {AuthProvider} from "./auth/components/AuthProvider";
import { NavBar } from "./components/NavBar";
import Landing from "./Landing"
import Dash from "./dash/Dash";
import RequireAuth from "./auth/components/RequireAuth";

let theme = createTheme({
    palette: {
      primary: {
          light: purple['100'],
          main : purple['600'],
        },
      secondary: {
          main : deepOrange['400']
        } 
    },
    typography:{
        fontFamily : ['Roboto', '"Helvetica Neue"'].join(", ") ,
        h4: { fontWeight: 500 },
        h5: { fontWeight : 500, textAlign: "center" },
        h6: { textAlign: "center"}
    }
  })

theme = responsiveFontSizes(theme);

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <SnackbarProvider autoHideDuration={2000} >
                        <NavBar/>
                        <Routes>
                            <Route index element={<Landing/>} />
                            <Route path="auth/*" element={<Auth rows={4} columns={4}/>}/>
                            <Route 
                                path="dash/*" 
                                element={
                                    <RequireAuth>
                                        <Dash/>
                                    </RequireAuth>
                                }/>
                        </Routes>
                    </SnackbarProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
};

export default App;