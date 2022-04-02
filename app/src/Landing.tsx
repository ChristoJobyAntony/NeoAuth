import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { render } from "react-dom";

const Landing = () => {
    return (
        <Box sx={{ height : "100%", display : "flex", flexDirection : "column", justifyContent: "center", alignContent: "center"}}>
            <Typography variant="h3">
                Hey World, Introducing the new way to login, Neo Auth
            </Typography>
        </Box>
    )
}

export default Landing;