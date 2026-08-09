import { Box, Button, ButtonBase, Card, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { CarouselItem } from "../../../components/Carousel";
import api from "../../api";
import { _Object } from "../../types";
import { tokens } from "../../../theme";

type props = {
    mode: "choose" | "confirm",
    prompt: string,
    hint: string,
    objects: _Object[],
    // confirm mode: auto-advance once this many objects are re-entered
    targetLength?: number,
    onCountChange: (count: number) => void,
    onNext: (objects: _Object[]) => void,
};

const MAX_OBJECTS = 8;
const MIN_OBJECTS = 6;

// The sequence tray: numbered slots that fill with the chosen objects, in
// order. During confirmation entries stay masked — the same way the real
// sign-in never echoes them back.
function SequenceTray({ selected, masked, slots }: { selected: _Object[], masked: boolean, slots: number }) {
    return (
        <Box sx={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
            {Array.from({ length: slots }, (_, i) => {
                const obj = selected[i];
                const optional = i >= MIN_OBJECTS;
                const isNext = !obj && i === selected.length;
                return (
                    <Box
                        key={`tray_slot_${i}`}
                        title={obj && !masked ? `${i + 1}. ${obj.name}` : undefined}
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "10px",
                            border: obj || isNext
                                ? `2px solid ${tokens.accent}`
                                : `1px ${optional ? "dotted" : "dashed"} ${tokens.lineStrong}`,
                            backgroundColor: isNext ? tokens.accentWash : tokens.card,
                            boxShadow: obj ? tokens.shadow1 : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: obj && masked ? 18 : 12,
                            color: isNext ? tokens.accentDark : tokens.inkFaint,
                            lineHeight: obj && !masked ? 0 : 1.4,
                        }}>
                        {obj
                            ? (masked ? "•" : <img src={api.getObject(obj.uid)} width="30" height="30" alt={obj.name} />)
                            : i + 1}
                    </Box>
                )
            })}
        </Box>
    )
}

function NeoPassSlide({ mode, prompt, hint, objects, targetLength, onCountChange, onNext }: props) {
    const [selected, setSelected] = useState<_Object[]>([]);
    const { enqueueSnackbar } = useSnackbar();

    const confirming = mode === "confirm";
    const slots = confirming ? (targetLength || MIN_OBJECTS) : MAX_OBJECTS;
    const limit = confirming ? (targetLength || MAX_OBJECTS) : MAX_OBJECTS;

    // Alphabetical order makes objects quick to find again — especially when
    // repeating the sequence on the confirmation step.
    const visible = [...objects].sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => { onCountChange(selected.length) }, [selected.length]);

    // Confirmation auto-advances at the target length: the progress bar and
    // tray carry the state, no Next button needed.
    useEffect(() => {
        if (confirming && targetLength && selected.length === targetLength) {
            const timer = setTimeout(() => {
                onNext(selected.slice());
                setSelected([]);
            }, 350);
            return () => clearTimeout(timer);
        }
    }, [confirming, targetLength, selected]);

    function onSelectObject(obj: _Object) {
        if (selected.some((s) => s.uid === obj.uid)) return;
        if (selected.length >= limit) {
            return enqueueSnackbar(`A NeoPass holds at most ${MAX_OBJECTS} objects`, { variant: "error" })
        }
        setSelected([...selected, obj]);
    }

    function next() {
        const chosen = selected.slice();
        onNext(chosen);
        setSelected([]);
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
                    padding: "6px 0 14px",
                    boxSizing: "border-box",
                }}>

                <div style={{ textAlign: "center" }}>
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
                        boxShadow: "none",
                        border: `1px solid ${tokens.line}`,
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
                                        borderRadius: "10px",
                                        border: "1px solid transparent",
                                        opacity: isPicked ? 0.4 : 1,
                                        backgroundColor: isPicked ? tokens.sunken : tokens.card,
                                        boxShadow: isPicked ? "none" : tokens.shadow1,
                                        transition: "border-color 120ms ease, box-shadow 120ms ease",
                                        "&:hover": { borderColor: "#B7D8C9", boxShadow: tokens.shadow2 },
                                    }}>
                                    <img width="40" height="40" src={api.getObject(obj.uid)} alt={obj.name} />
                                    <Typography variant="caption">
                                        {obj.name}
                                    </Typography>
                                </ButtonBase>
                            )
                        })
                    }
                </Card>

                <SequenceTray selected={selected} masked={confirming} slots={slots} />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        width: "90%",
                        minHeight: "38px",
                    }}>
                    <Button
                        variant="text"
                        disabled={selected.length === 0}
                        onClick={() => setSelected(selected.slice(0, -1))}>
                        Undo
                    </Button>
                    {!confirming &&
                        <Button
                            variant="contained"
                            disabled={selected.length < MIN_OBJECTS}
                            onClick={next}>
                            Continue
                        </Button>}
                </div>
            </div>
        </CarouselItem>)
}

export default NeoPassSlide;
