import { Button, Typography } from "@mui/material";
import {useNavigate} from "react-router-dom";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import React from "react";

import { CarouselItem } from "../../../components/Carousel";
import { useSnackbar } from "notistack";


function SuccessSlide () {
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    return (
        <CarouselItem width="100%">
            <div
            style={{
                width:"100%",
                height:"100%",
                display:"flex",
                flexDirection: "column",
                justifyContent: "space-evenly", 
                alignItems: "center",
            }}>
                
                <div 
                style={{
                    flex: "0 0",
                    padding: "20px"
                }}>
                    <Typography variant="h5" align="center" whiteSpace="normal">
                        Great Job 🎉 🥳, Your all done 👍
                    </Typography>

                </div>

                <div
                    style={{
                        flex: "2 0",
                        width:"90%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-evenly"
                    }}>

                        <CheckCircleOutlineOutlinedIcon fontSize="large" color="success"/>
                        <Typography variant="h6" whiteSpace='normal' textAlign='center'>
                            You have been successfully registered with NeoAuth <SecurityOutlinedIcon/>. <br/>
                            Welcome to the future of secure and effortless authentication.
                        </Typography>

                    
                </div>
                    
                <div
                    style={{
                        flex: "1 0",
                        width: "90%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    
                    <Button
                        variant="outlined"
                        onClick={()=>{
                            enqueueSnackbar('Login using your the credentials you created', {variant : "info"});
                            navigate('/auth')
                        }}>
                        Login to you account
                    </Button>
                </div>


            </div>
        </CarouselItem>
    )
}

export default SuccessSlide;