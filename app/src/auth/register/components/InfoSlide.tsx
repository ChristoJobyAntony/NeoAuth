import { Button, Typography } from "@mui/material";
import React from "react";
import { CarouselItem } from "../../../components/Carousel";

type props = {
    onNext : () => void,
    onPrev : () => void,
}

function InfoSlide ({onPrev, onNext} : props) {
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
                    flexGrow: 1,
                    padding: "20px"
                }}>
                <Typography variant="h4" align="center" whiteSpace="normal">
                    A short note 📑
                </Typography>

            </div>

            <div
                style={{
                    flexGrow: 3,
                    width:"90%"
                }}>

                <Typography 
                    component="div"
                    variant="body1"
                    whiteSpace="normal">

                    Now we are gonna set up your NeoPass.
                    <ul>
                    <li>A NeoPass consists of 4 - 8 objects in a specific order.</li>
                    <li>You can select the same object twice but not consequently.</li>
                    <li>These objects will be the password for all you future login attempts. </li>   
                    </ul>                         
                    Best of luck 👍
                    

                </Typography>
            </div>
                
            <div
                style={{
                    flexGrow: 1,
                    width: "90%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                
                <Button
                    variant="outlined"
                    onClick={onPrev}>
                    Back
                </Button>

                <Button
                    variant="outlined"
                    onClick={onNext}>
                    Next
                </Button>
            </div>


        </div>
    </CarouselItem>)
}

export default InfoSlide;