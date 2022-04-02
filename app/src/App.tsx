import React from "react";
import {deepPurple, deepOrange, purple} from '@mui/material/colors';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from 'notistack';

import Auth from "./Auth/Auth";
import { NavBar } from "./components/NavBar";
import Landing from "./Landing"

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
        h5: { fontWeight : 500 }
    }
  })

// theme = responsiveFontSizes(theme);

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <SnackbarProvider autoHideDuration={2000} >
                    <NavBar />
                    <Routes>
                        <Route index element={<Landing/>} />
                        <Route path="auth/*" element={<Auth rows={4} columns={4}/>}/>
                    </Routes>
                </SnackbarProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
};

export default App;