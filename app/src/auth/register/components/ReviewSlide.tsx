import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React from "react";

import { CarouselItem } from "../../../components/Carousel";

type Step = {
    label : string,
    slide : number
}

const steps : Step[]= [
    {
        label : "Configure Email 📧",
        slide : 0
    },{
        label : "Some Specifics 📋",
        slide : 1
    }, {
        label : "Set-up Neo Pass 🛡️",
        slide : 3
    },{
        label : "Register 🚀 ",
        slide : 5
    }
]

type props = {
    setSlide : React.Dispatch<React.SetStateAction<number>>,
    onNext : () => void,
    onPrev : () => void,
}

function ReviewSlide ({setSlide, onNext, onPrev} : props) {
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
                        A review before we make things final 👓
                    </Typography>

                </div>

                <div
                style={{
                    flex: "2 0",
                    width:"90%",
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "center"
                }}>

                    <Stepper
                    activeStep={3}
                    orientation="vertical">
                        {
                        steps.map(step => 
                                <Step key={step.label}>
                                    <StepLabel>
                                        <Button
                                            onClick={() => setSlide(step.slide)}>
                                            {step.label}
                                        </Button>
                                    </StepLabel>
                                </Step> 
                            )
                        }

                    </Stepper>
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
                    onClick={ onNext }>
                        Register
                    </Button>
                </div>


            </div>
        </CarouselItem>
    )
}

export default ReviewSlide;