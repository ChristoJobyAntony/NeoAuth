import { Box, Button, ButtonBase, Card, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { CarouselItem } from "../../../components/Carousel";
import api from "../../api";
import { _Object } from "../../types";
import { tokens } from "../../../theme";

type props = {
    step: number,
    prompt: string,
    hint: string,
    objects: _Object[],
    onPrev: () => void,
    onNext: (objects: _Object[]) => void,
};

const MAX_OBJECTS = 8;
const MIN_OBJECTS = 6;

// The sequence tray: numbered slots that fill with the chosen objects, in
// order — the ordered sequence IS the NeoPass.
function SequenceTray({ selected }: { selected: _Object[] }) {
    return (
        <Box sx={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
            {Array.from({ length: MAX_OBJECTS }, (_, i) => {
                const obj = selected[i];
                const optional = i >= MIN_OBJECTS;
                return (
                    <Box
                        key={`tray_slot_${i}`}
                        title={obj ? `${i + 1}. ${obj.name}` : undefined}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "9px",
                            border: obj ? `2px solid ${tokens.cobalt}` : `1px ${optional ? "dotted" : "dashed"} ${tokens.line}`,
                            backgroundColor: tokens.card,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            color: tokens.inkSoft,
                        }}>
                        {obj
                            ? <img src={api.getObject(obj.uid)} width="28" height="28" alt={obj.name} />
                            : i + 1}
                    </Box>
                )
            })}
        </Box>
    )
}

function NeoPassSlide({ step, prompt, hint, objects, onPrev, onNext }: props) {
    const [selected, setSelected] = useState<_Object[]>([]);
    const { enqueueSnackbar } = useSnackbar();

    // Alphabetical order makes objects quick to find again — especially when
    // repeating the sequence on the confirmation step.
    const visible = [...objects].sort((a, b) => a.name.localeCompare(b.name));

    function onSelectObject(obj: _Object) {
        if (selected.some((s) => s.uid === obj.uid)) return;
        if (selected.length >= MAX_OBJECTS) {
            return enqueueSnackbar(`A NeoPass holds at most ${MAX_OBJECTS} objects`, { variant: "error" })
        }
        setSelected([...selected, obj]);
    }

    function reset() {
        setSelected([]);
    }

    function next() {
        const chosen = selected.slice();
        onNext(chosen);
        reset();
    }

    return (
        <CarouselItem width="100%">
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 0 14px",
                    boxSizing: "border-box",
                }}>

                <div style={{ textAlign: "center" }}>
                    <Typography variant="overline">Create account — step {step} of 6</Typography>
                    <Typography variant="h5" sx={{ whiteSpace: "normal", px: 2 }}>{prompt}</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "normal", px: 3, mt: 0.5 }}>{hint}</Typography>
                </div>

                <Card
                    sx={{
                        width: "92%",
                        flex: "1 1 0",
                        minHeight: 0,
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(86px, 1fr))",
                        gap: "6px",
                        padding: "10px",
                        boxSizing: "border-box",
                        alignContent: "start",
                    }}>
                    {
                        visible.map((obj) => {
                            const isPicked = selected.some((s) => s.uid === obj.uid);
                            return (
                                <ButtonBase
                                    key={`register_object_${obj.uid}`}
                                    focusRipple
                                    disabled={isPicked}
                                    onClick={(_) => onSelectObject(obj)}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        padding: "8px 4px",
                                        borderRadius: "9px",
                                        border: `1px solid ${isPicked ? tokens.cobalt : tokens.line}`,
                                        opacity: isPicked ? 0.35 : 1,
                                        backgroundColor: tokens.card,
                                        transition: "border-color 120ms ease",
                                        "&:hover": { borderColor: tokens.cobalt },
                                    }}>
                                    <img width="40" height="40" src={api.getObject(obj.uid)} alt={obj.name} />
                                    <Typography variant="caption" sx={{ color: tokens.inkSoft }}>
                                        {obj.name}
                                    </Typography>
                                </ButtonBase>
                            )
                        })
                    }
                </Card>

                <SequenceTray selected={selected} />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "90%",
                    }}>
                    <Button variant="text" onClick={() => { reset(); onPrev(); }}>
                        Back
                    </Button>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                            variant="text"
                            disabled={selected.length === 0}
                            onClick={() => setSelected(selected.slice(0, -1))}>
                            Undo
                        </Button>
                        <Button
                            variant="contained"
                            disabled={selected.length < MIN_OBJECTS}
                            onClick={next}>
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </CarouselItem>)
}

export default NeoPassSlide;
