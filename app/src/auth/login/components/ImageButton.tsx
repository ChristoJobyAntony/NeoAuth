import { Button } from "@mui/material";
import React from "react";

import { Image, Challenge} from "../../types";
import {getImageUrl} from "../../api";

type props = {
    image : Image,
    challenge : Challenge,
    onSelect: () => void
}

export function ImageButton ({image, challenge, onSelect}: props) {
    return (
        <Button 
            variant="outlined"
            key={image.uid}
            style={{
                width:"100%",
                height: "auto",
                aspectRatio: "1",
                border:"2px solid black",
                padding:"0px",
                borderColor: (image.uid === challenge.selection?.uid) ? "red" : "black"
            }}
            onClick={() => onSelect()}
            >
            <img
                style={{
                    width:"100%",
                    height: undefined,
                    aspectRatio: "1",
                    objectFit: "contain"
                }} 
                src={getImageUrl(image.uid)}
                loading="lazy"/>
        </Button>
    )

}

export default ImageButton;