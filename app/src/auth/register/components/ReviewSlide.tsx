import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React from "react";

import { CarouselItem } from "../../../components/Carousel";

type StepDef = {
    label: string,
    slide: number
}

const steps: StepDef[] = [
    { label: "Email address and name", slide: 0 },
    { label: "Secret object sequence", slide: 1 },
    { label: "Create account", slide: 3 },
]

type props = {
    setSlide: React.Dispatch<React.SetStateAction<number>>,
    onNext: () => void,
}

function ReviewSlide({ setSlide, onNext }: props) {
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

                <div style={{ textAlign: "center", padding: "10px 20px 0" }}>
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
                    <Stepper activeStep={2} orientation="vertical">
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
