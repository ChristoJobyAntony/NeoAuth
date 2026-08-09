import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { CarouselItem } from "../../../components/Carousel";
import { tokens } from "../../../theme";

type props = {
    onNext: () => void,
    onPrev: () => void,
}

const RULES = [
    "Your NeoPass is a sequence of 6 to 8 different objects.",
    "The order you pick them in matters — it is part of the secret.",
    "To sign in, you'll spot each object hidden inside a grid of images, one challenge at a time.",
    "Nobody watching your screen can tell which object in an image is yours.",
]

function InfoSlide({ onPrev, onNext }: props) {
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

                <div style={{ textAlign: "center", padding: "16px" }}>
                    <Typography variant="overline">
                        Create account — step 3 of 6
                    </Typography>
                    <Typography variant="h4" align="center" whiteSpace="normal">
                        How a NeoPass works
                    </Typography>
                </div>

                <Box sx={{ width: "84%", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {RULES.map((rule, i) => (
                        <Box key={`rule_${i}`} sx={{ display: "flex", gap: "14px", alignItems: "baseline" }}>
                            <Typography sx={{ color: tokens.cobalt, fontSize: 13 }}>
                                {String(i + 1).padStart(2, "0")}
                            </Typography>
                            <Typography variant="body1" whiteSpace="normal">
                                {rule}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <div
                    style={{
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Button variant="text" onClick={onPrev}>
                        Back
                    </Button>
                    <Button variant="contained" onClick={onNext}>
                        Choose my objects
                    </Button>
                </div>
            </div>
        </CarouselItem>)
}

export default InfoSlide;
