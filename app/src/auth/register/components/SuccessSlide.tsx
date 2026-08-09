import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import React from "react";

import { CarouselItem } from "../../../components/Carousel";

function SuccessSlide() {
    const navigate = useNavigate();

    return (
        <CarouselItem width="100%">
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                }}>

                <div
                    style={{
                        width: "80%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "18px",
                    }}>
                    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 56 }} color="success" />
                    <Typography variant="h4" whiteSpace='normal' textAlign='center'>
                        Your NeoPass is ready
                    </Typography>
                    <Typography variant="body1" whiteSpace='normal' textAlign='center' color="text.secondary">
                        Remember your objects and their order — that sequence is now your only password.
                    </Typography>
                </div>

                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/auth')}>
                    Sign in with your NeoPass
                </Button>
            </div>
        </CarouselItem>
    )
}

export default SuccessSlide;
