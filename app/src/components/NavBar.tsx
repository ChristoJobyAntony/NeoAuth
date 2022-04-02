import React from "react";

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SecurityIcon from '@mui/icons-material/Security';
import { Link } from 'react-router-dom'
import { ChildFriendlyOutlined } from '@mui/icons-material'


export function NavBar () {
  
  return(
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <SecurityIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              NeoAuth
            </Typography>
            <Button color="inherit">
                <Link  to="/" style={{textDecoration: "inherit", color: "inherit"}}>Home</Link>
            </Button>
            <Button color="inherit">
                <Link to="/auth" style={{textDecoration: "inherit", color: "inherit"}}>Login</Link>
            </Button>
            <Button color="inherit">
                <Link to="/auth/register" style={{textDecoration: "inherit", color: "inherit"}}>Register</Link>
            </Button>
          </Toolbar>
        </AppBar>
    )
}