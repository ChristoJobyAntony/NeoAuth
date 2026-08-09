import React, { useState } from "react";

import { Box, Button, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";

import { useAuth } from "../auth/components/AuthProvider";
import { tokens } from "../theme";

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
    <Box sx={{ padding: "16px 16px 0", flexShrink: 0 }}>
      <Box
        component="nav"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: tokens.card,
          borderRadius: "12px",
          boxShadow: tokens.shadow1,
          padding: "8px 16px",
        }}>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            aria-label="menu"
            aria-controls="sideNavBar"
            onClick={() => setSideNavMenu(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Drawer
          anchor="left"
          open={sideNavMenu}
          onClose={() => setSideNavMenu(false)}>
          <Box role="presentation" onClick={() => setSideNavMenu(false)}>
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

        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            aria-label="home"
            onClick={() => navigate("/")}
            sx={{ gap: "8px", paddingInline: "8px", color: tokens.ink, "&:hover": { backgroundColor: tokens.sunken } }}>
            <ShieldOutlinedIcon sx={{ color: tokens.accent, fontSize: 20 }} />
            <Typography sx={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>
              NeoAuth
            </Typography>
          </Button>
          <Typography
            sx={{
              fontSize: 14,
              color: tokens.inkFaint,
              display: { xs: "none", sm: "block" },
            }}>
            Graphical authentication — research demo
          </Typography>
        </Box>

        <Box display={{ xs: "none", md: "flex" }} gap="8px">
          {visibleLinks.map((link, i) =>
            <Button
              key={link.name}
              onClick={link.action}
              startIcon={link.icon}
              variant={i === visibleLinks.length - 1 && !auth.token ? "contained" : "text"}
              sx={i === visibleLinks.length - 1 && !auth.token
                ? {}
                : { color: tokens.ink, "&:hover": { backgroundColor: tokens.sunken } }}>
              {link.name}
            </Button>
          )}
        </Box>

      </Box>
    </Box>
  )
}
