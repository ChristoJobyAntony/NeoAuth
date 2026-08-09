import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { CarouselItem } from "../../../components/Carousel";
import ImageButton from "./ImageButton";
import { Image, ImageSet } from "../../types";
import { getImageUrl } from "../../api";
import { mono, tokens } from "../../../theme";

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const DIMENSION = 4;

type props = {
    index: number,
    total: number,
    imageSet: ImageSet,
    selections: (Image | undefined)[],
    selection: Image | undefined,
    onSelect: (image: Image) => void,
    onReset: () => void,
    onNext: () => void,
    onLogin?: () => void,
}

// The sequence tray: one numbered slot per challenge, filling up with a
// thumbnail of each answered challenge — order is the scheme.
function SequenceTray({ selections, current }: { selections: (Image | undefined)[], current: number }) {
    return (
        <Box sx={{ display: "flex", gap: "6px", justifyContent: "center" }} aria-hidden>
            {selections.map((selection, i) => (
                <Box
                    key={`tray_${i}`}
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "8px",
                        border: i === current ? `2px solid ${tokens.cobalt}` : `1px solid ${tokens.line}`,
                        backgroundColor: tokens.card,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        fontFamily: mono,
                        fontSize: 12,
                        color: tokens.inkSoft,
                    }}>
                    {selection
                        ? <img src={getImageUrl(selection.uid)} width="30" height="30" style={{ objectFit: "cover", borderRadius: 5 }} alt="" />
                        : i + 1}
                </Box>
            ))}
        </Box>
    )
}

function ChallengeSlide({ index, total, imageSet, selections, selection, onSelect, onReset, onNext, onLogin }: props) {

    return <CarouselItem width="100%">
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "22px 0 16px",
                boxSizing: "border-box",
            }}>

            <div style={{ textAlign: "center" }}>
                <Typography variant="overline">
                    Challenge {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </Typography>
                <Typography variant="h5" sx={{ whiteSpace: "normal", px: 2 }}>
                    Find your {ORDINALS[index]} secret object
                </Typography>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${DIMENSION}, 1fr)`,
                    gap: "8px",
                    width: "min(92%, 54vh)",
                }}>
                {imageSet.images.map((image, j) => {
                    return (
                        <ImageButton
                            key={image.uid}
                            image={image}
                            position={j + 1}
                            selected={selection?.uid === image.uid}
                            onSelect={() => onSelect(image)} />
                    )
                })}
            </div>

            <SequenceTray selections={selections} current={index} />

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "90%",
                }}>
                <Button variant="text" size="medium" onClick={onReset}>
                    Start over
                </Button>

                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        variant="contained"
                        disabled={!onLogin}
                        size="medium"
                        onClick={onLogin}>
                        Sign in
                    </Button>

                    <Button
                        variant="outlined"
                        disabled={index + 1 >= total}
                        size="medium"
                        onClick={onNext}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    </CarouselItem>
}

export default ChallengeSlide;
