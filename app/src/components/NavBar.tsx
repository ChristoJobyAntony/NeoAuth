import React, { useState } from "react";

import { AppBar, Toolbar, Button, IconButton, Typography, Box, Drawer, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";

import { useAuth } from "../auth/components/AuthProvider";
import { mono, tokens } from "../theme";

type NavLink = {
  name: string,
  public: boolean,
  icon: React.ReactNode,
  action: () => void
}

export function NavBar() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const auth = useAuth();
  const [sideNavMenu, setSideNavMenu] = useState(false);

  const links: NavLink[] = [
    { name: "Sign in", public: true, icon: <LoginIcon fontSize="small" />, action: () => navigate("/auth") },
    { name: "Create account", public: true, icon: <PersonAddIcon fontSize="small" />, action: () => navigate("/auth/register") },
    { name: "Dashboard", public: false, icon: <DashboardIcon fontSize="small" />, action: () => navigate("/dash") },
    { name: "Sign out", public: false, icon: <LogoutIcon fontSize="small" />, action: () => auth.signOut(() => enqueueSnackbar("Signed out")) }
  ]

  const visibleLinks = links.filter((link) => (link.public && !auth.token) || (!link.public && auth.token));

  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ minHeight: 56 }}>

        <Box
          sx={{
            flex: "0 0",
            display: { xs: "flex", md: "none" },
          }}>
          <IconButton
            aria-label="menu"
            aria-controls="sideNavBar"
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
            role="presentation"
            onClick={() => setSideNavMenu(false)}>
            <List sx={{ minWidth: "56vw" }}>
              {visibleLinks.map((link) =>
                <ListItemButton key={link.name} onClick={link.action} >
                  <ListItemIcon> {link.icon} </ListItemIcon>
                  <ListItemText> {link.name} </ListItemText>
                </ListItemButton>
              )}
            </List>
          </Box>
        </Drawer>

        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            color="inherit"
            aria-label="home"
            onClick={() => navigate("/")}
            sx={{ gap: "8px", paddingInline: "6px" }}>
            <ShieldOutlinedIcon sx={{ color: tokens.cobalt }} />
            <Typography variant="h6" sx={{ letterSpacing: "-0.02em" }}>
              NeoAuth
            </Typography>
          </Button>
          <Typography
            sx={{
              fontFamily: mono,
              fontSize: 11,
              letterSpacing: "0.12em",
              color: tokens.inkSoft,
              display: { xs: "none", sm: "block" },
            }}>
            COGNOMETRIC AUTH — RESEARCH DEMO
          </Typography>
        </Box>

        <Box display={{ xs: "none", md: "flex" }} gap="6px">
          {visibleLinks.map((link, i) =>
            <Button
              key={link.name}
              onClick={link.action}
              startIcon={link.icon}
              variant={i === visibleLinks.length - 1 && !auth.token ? "contained" : "text"}
              color={i === visibleLinks.length - 1 && !auth.token ? "primary" : "inherit"}>
              {link.name}
            </Button>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  )
}
