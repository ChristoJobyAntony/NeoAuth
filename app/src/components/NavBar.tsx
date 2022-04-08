import React, { useState } from "react";

import {AppBar, Toolbar, Button, IconButton, Typography, Box, Drawer, ListItem, List, ListItemText, ListItemIcon} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useNavigate} from 'react-router-dom';
import { useSnackbar } from "notistack";

import { useAuth } from "../auth/components/AuthProvider";

type Link =  {
  name: string,
  public: boolean,
  icon: React.ReactNode,
  action: ()=>void
}

export function NavBar () {
  const {enqueueSnackbar} = useSnackbar();
  const navigate =  useNavigate();
  const auth = useAuth();
  const [sideNavMenu, setSideNavMenu] = useState(false);

  const links : Link[] = [
    {name: "Login", public: true, icon: <LoginIcon/>, action: () => navigate("/auth")},
    {name: "Register", public: true, icon: <PersonAddIcon/>, action: () => navigate("/auth/register")},
    {name: "DashBoard", public: false, icon: <DashboardIcon/>, action: () => navigate("/dash")},
    {name: "SignOut", public: false, icon: <LogoutIcon/>, action: () => auth.signOut(() => enqueueSnackbar("Signed Out"))}
  ]
  
  return(
        <AppBar position="static">
          <Toolbar>

            <Box
              sx={{
                flex: "0 0",
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="sidNaveBar"
                onClick={() => setSideNavMenu(true)}
                color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>

            <Drawer
              anchor="left"
              open={sideNavMenu}
              onClose={() => setSideNavMenu(false)}>
              <Box
                sx={{
                  width: "50%"
                }}
                role="presentation"
                onClick={() => setSideNavMenu(false)}>
                
                <List
                  sx={{
                    minWidth: "40vw",
                    maxWidth: "auto",
                    marginRight: "20px"
                  }}>
                  {
                    links
                    .filter((link) => (link.public && !auth.token) || (!link.public && auth.token))
                    .map((link)=>
                     <ListItem key={link.name} button onClick={link.action} >
                        <ListItemIcon> {link.icon} </ListItemIcon>
                        <ListItemText> {link.name} </ListItemText>
                     </ListItem>   
                )}                    
                </List>

              </Box>
            </Drawer>
            
            <div
              style={{
                flexGrow: "1"
              }}>

              <Button
                startIcon={<SecurityIcon />}
                size="large"
                color="inherit"
                aria-label="home"
                sx={{ mr: 2 }}
                onClick={()=>navigate("/")}>
                <Typography 
                  variant="h6" 
                  textAlign="left"
                  textTransform="initial">
                  NeoAuth
                </Typography>
              </Button>
            </div>

            <Box
              display={{xs : "none", md: "block"}}>
              <>
              {links
              .filter((link) => (link.public && !auth.token) || (!link.public && auth.token))
              .map((link)=>
                <Button key={link.name} onClick={link.action} startIcon={link.icon} color="inherit">
                  {link.name}
                </Button>
                )}
              </>
            </Box>

          </Toolbar>
        </AppBar>
    )
}