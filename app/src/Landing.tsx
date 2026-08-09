import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "./auth/api";
import { _Object } from "./auth/types";
import { mono, tokens } from "./theme";

// The hero states the thesis and shows the material: the object vocabulary
// itself, straight from the server.
const Landing = () => {
    const navigate = useNavigate();
    const [objects, setObjects] = useState<_Object[]>([]);

    useEffect(() => {
        api.getObjectsInfo()
            .then((all) => setObjects(all.slice(0, 16)))
            .catch(() => { /* the hero still reads without the strip */ });
    }, []);

    return (
        <Box sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "34px",
            padding: "0 20px",
            textAlign: "center",
            overflowY: "auto",
        }}>
            <Typography variant="overline">
                A graphical authentication system resistant to shoulder-surfing
            </Typography>

            <Typography variant="h3" sx={{ maxWidth: "17ch" }}>
                Your password is a sequence of objects
            </Typography>

            <Typography variant="subtitle1" sx={{ maxWidth: "52ch" }}>
                Choose 6–8 everyday objects and remember their order. To sign in, spot each
                one hidden inside a grid of composite images — an onlooker watching your
                screen still can't tell which object is yours.
            </Typography>

            {objects.length > 0 &&
                <Box aria-hidden sx={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: "620px",
                }}>
                    {objects.map((obj, i) => (
                        <Box key={obj.uid} sx={{
                            width: 46,
                            height: 46,
                            borderRadius: "10px",
                            border: `1px solid ${tokens.line}`,
                            backgroundColor: tokens.card,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <img src={api.getObject(obj.uid)} width="30" height="30" alt="" loading="lazy" />
                        </Box>
                    ))}
                </Box>}

            <Box sx={{ display: "flex", gap: "14px" }}>
                <Button variant="contained" size="large" onClick={() => navigate("/auth/register")}>
                    Try the demo
                </Button>
                <Button variant="outlined" size="large" onClick={() => navigate("/auth")}>
                    Sign in
                </Button>
            </Box>

            <Typography sx={{ fontFamily: mono, fontSize: 11, color: tokens.inkSoft, letterSpacing: "0.06em" }}>
                COMP4500 RESEARCH PROTOTYPE · ANU · ANONYMOUS TIMING DATA RECORDED FOR EVALUATION
            </Typography>
        </Box>
    )
}

export default Landing;
