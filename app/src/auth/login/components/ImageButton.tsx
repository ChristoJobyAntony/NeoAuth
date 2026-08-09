import { Box, ButtonBase } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React from "react";

import { Image } from "../../types";
import { getImageUrl } from "../../api";
import { tokens } from "../../../theme";

type props = {
    image: Image,
    position: number,
    selected: boolean,
    onSelect: () => void
}

export function ImageButton({ image, position, selected, onSelect }: props) {
    return (
        <ButtonBase
            focusRipple
            aria-pressed={selected}
            style={{
                width: "100%",
                height: "auto",
                aspectRatio: "1",
                borderRadius: "10px",
                border: selected ? `3px solid ${tokens.cobalt}` : `1px solid ${tokens.line}`,
                backgroundColor: "#fff",
                padding: 0,
                position: "relative",
                overflow: "hidden",
                transition: "border-color 120ms ease, transform 120ms ease",
            }}
            onClick={() => onSelect()}
        >
            <img
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                }}
                src={getImageUrl(image.uid)}
                alt={`Challenge image ${position}`}
                loading="lazy" />
            {selected &&
                <Box sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    lineHeight: 0,
                    color: tokens.cobalt,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                }}>
                    <CheckCircleIcon fontSize="small" />
                </Box>}
        </ButtonBase>
    )
}

export default ImageButton;
