import { Button, Typography,  } from "@mui/material";
import React from "react";
import { CarouselItem } from "../../../components/Carousel";
import ImageButton from "./ImageButton";
import { Challenge } from "../../types";

const NUMBERS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
const DIMENSION = 4;


type props = {
    index: number, 
    challenge: Challenge,
    updateChallenge: (challenge : Partial<Challenge>) => void,
    onReset: () => void,
    onNext: () => void,
    onLogin?: () => void,
}

function ChallengeSlide ({index, challenge, updateChallenge, onReset, onNext, onLogin} : props) {

    return <CarouselItem width="100%">
        <div 
            style={{ 
                display: "flex", 
                flexDirection: "column", 
                height:"100%", 
                width: "100%", 
                alignItems:"center", 
                justifyContent: "space-evenly"}}
                >
            <Typography variant="h6" padding="10px">
                Select the image with your {NUMBERS[index]} secret object 🔎
            </Typography>

            <div 
                style={{ 
                    display: "grid", 
                    gridTemplateColumns: `repeat(${DIMENSION}, auto)`, 
                    columnGap: "7px", 
                    rowGap:"5px", 
                    maxWidth:"50vh", 
                    flex: "0 0" }}>
                
                {challenge.imageSet?.images.map((image, j) => {
                    return(
                        <ImageButton 
                            image={image} 
                            challenge={challenge}
                            onSelect={() => {
                                updateChallenge({selection : image})
                            }}/>
                    )
                })}
            </div>
            <div 
                style={{
                    flex:"1 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "90%",
                    }}>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={onReset}>
                    Reset
                </Button>

                <Button
                    variant="outlined"
                    disabled={onLogin ? false : true}
                    size="medium"
                    onClick={onLogin ? onLogin : undefined}>
                    Login 🔑
                </Button>

                <Button
                    variant="outlined"
                    disabled={index < NUMBERS.length ? false : true}
                    size="medium"
                    onClick={onNext}>
                    Next
                </Button>
                
            </div>
        </div>
    </CarouselItem>
}

export default ChallengeSlide;