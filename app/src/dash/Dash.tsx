import React from "react";
import { Avatar, Box, Button, Card, Grid, Typography } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import { useAuth } from "../auth/components/AuthProvider";
import { display } from "@mui/system";


function Dash () {
    const {user} = useAuth();
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:"primary.light",
                paddingInline: "10px",
            }}>
            
            <Grid 
                container 
                spacing={2}
                maxWidth='md'>
                {/* The title card */}
                <Grid 
                    item 
                    xs={12}>
                   <Card
                        raised>
                       <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "stretch",
                                height: "20vh",
                            }}>
                            <div
                                style={{
                                    flex: "1 0",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Avatar
                                        sx={{
                                            height: "50%",
                                            width: "auto",
                                            aspectRatio : "1",
                                            backgroundColor: "primary.dark"
                                        }}> 
                                        <Typography 
                                            variant="h4"
                                            whiteSpace="normal">
                                            {user?.name.slice(0, 1)} 
                                        </Typography>
                                    </Avatar>
                            </div>

                            <div
                                style={{
                                    flex: "3 0",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}>
                                    <Typography
                                        variant="h5"
                                        textAlign="left">
                                        Hey there {user?.name} 👋,<br/>
                                        Welcome to Your Privacy Dashboard
                                    </Typography>
                            </div>


                       </div>
                    </Card> 
                </Grid>

                <Grid
                    item 
                    xs={6}
                    lg={4}>
                    <Card
                        raised>
                        <div
                            style={{
                                height:"30vh",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-evenly",
                                alignItems : "center",
                            }}>
                            <InfoIcon 
                                color="primary"
                                fontSize="large"/>
                                <Typography
                                    variant="h6">
                                        Your personal information
                                </Typography>
                        </div>
                    </Card>                        
                </Grid>

                <Grid
                    item 
                    xs={6}
                    lg={4}>
                    <Card
                        raised>
                        <div
                            style={{
                                height:"30vh",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-evenly",
                                alignItems : "center",
                            }}>
                            <LinkIcon
                                color="primary"
                                fontSize="large"/>
                                <Typography
                                    variant="h6">
                                        View Linked Applications
                                </Typography>
                        </div>
                    </Card>                        
                </Grid>



                <Grid
                    item 
                    xs={6}
                    lg={4}>
                    <Card
                        raised>
                        <div
                            style={{
                                height:"30vh",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-evenly",
                                alignItems : "center",
                            }}>
                            <AnalyticsIcon
                                color="primary"
                                fontSize="large"/>
                                <Typography
                                    variant="h6">
                                    Account Activity
                                </Typography>
                        </div>
                    </Card>                        
                </Grid>
            </Grid>
        </Box>
    )
}

export default Dash;