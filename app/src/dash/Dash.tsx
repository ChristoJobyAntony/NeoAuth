import React from "react";
import { Avatar, Box, Card, Grid, Typography } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import { useAuth } from "../auth/components/AuthProvider";
import { tokens } from "../theme";

const cards = [
    { icon: <InfoIcon color="primary" fontSize="large" />, title: "Your personal information" },
    { icon: <LinkIcon color="primary" fontSize="large" />, title: "Linked applications" },
    { icon: <AnalyticsIcon color="primary" fontSize="large" />, title: "Account activity" },
]

function Dash() {
    const { user } = useAuth();
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "background.default",
                paddingInline: "16px",
            }}>

            <Grid container spacing={2} maxWidth='md'>
                <Grid item xs={12}>
                    <Card>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "22px",
                            padding: "28px",
                        }}>
                            <Avatar
                                sx={{
                                    height: 64,
                                    width: 64,
                                    backgroundColor: tokens.cobalt,
                                    fontWeight: 600,
                                    fontSize: 26,
                                }}>
                                {user?.name.slice(0, 1)}
                            </Avatar>
                            <div>
                                <Typography variant="overline">
                                    Signed in with a NeoPass
                                </Typography>
                                <Typography variant="h5" textAlign="left">
                                    Welcome back, {user?.name}
                                </Typography>
                            </div>
                        </Box>
                    </Card>
                </Grid>

                {cards.map((card) => (
                    <Grid item xs={12} sm={4} key={card.title}>
                        <Card>
                            <Box sx={{
                                height: "22vh",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "14px",
                            }}>
                                {card.icon}
                                <Typography variant="h6" textAlign="center">
                                    {card.title}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default Dash;
