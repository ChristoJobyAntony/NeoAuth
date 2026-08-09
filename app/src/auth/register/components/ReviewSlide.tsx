import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React from "react";

import { CarouselItem } from "../../../components/Carousel";

type StepDef = {
    label: string,
    slide: number
}

const steps: StepDef[] = [
    { label: "Email address", slide: 0 },
    { label: "Your name", slide: 1 },
    { label: "Secret object sequence", slide: 3 },
    { label: "Create account", slide: 5 },
]

type props = {
    setSlide: React.Dispatch<React.SetStateAction<number>>,
    onNext: () => void,
    onPrev: () => void,
}

function ReviewSlide({ setSlide, onNext, onPrev }: props) {
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

                <div style={{ textAlign: "center", padding: "20px" }}>
                    <Typography variant="overline">
                        Create account — step 6 of 6
                    </Typography>
                    <Typography variant="h4" align="center" whiteSpace="normal">
                        Review before you finish
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: "normal" }}>
                        Select any step to change it.
                    </Typography>
                </div>

                <div
                    style={{
                        width: "90%",
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "center"
                    }}>
                    <Stepper activeStep={3} orientation="vertical">
                        {
                            steps.map(step =>
                                <Step key={step.label}>
                                    <StepLabel>
                                        <Button
                                            variant="text"
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
                        width: "90%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        id="auth__register__button_submit"
                        variant="contained"
                        size="large"
                        onClick={onNext}>
                        Create my account
                    </Button>
                </div>
            </div>
        </CarouselItem>
    )
}

export default ReviewSlide;
