import { Box, ButtonBase, Typography } from "@mui/material";
import React from "react";

import { tokens } from "../../../theme";

export type SubProgress = { filled: number, count: number }

type props = {
    steps: string[],
    current: number,          // index into steps; steps.length == everything done
    // Per-step sub-segments: the current step's bar splits into `count`
    // mini-blocks that fill as work lands (e.g. one block per object picked).
    subProgress?: Partial<Record<number, SubProgress>>,
    onJump?: (step: number) => void,  // navigate back via a completed segment
}

// The universal progress bar from the sign-up prototype: one segment per
// step, the bar itself is the navigation — completed segments are buttons.
function RegisterProgress({ steps, current, subProgress, onJump }: props) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "22px 24px 12px" }}>
            <Box sx={{ display: "flex", gap: "8px", width: "100%", maxWidth: "520px" }}>
                {steps.map((name, i) => {
                    const done = i < current;
                    const isCurrent = i === current;
                    const sub = isCurrent ? subProgress?.[i] : undefined;
                    const bar = sub
                        ? <Box sx={{ display: "flex", gap: "3px", width: "100%" }}>
                            {Array.from({ length: sub.count }, (_, j) => (
                                <Box key={j} sx={{
                                    flex: 1,
                                    height: "4px",
                                    borderRadius: "2px",
                                    backgroundColor: j < sub.filled ? tokens.accent : tokens.line,
                                }} />
                            ))}
                        </Box>
                        : <Box sx={{
                            height: "4px",
                            borderRadius: "2px",
                            width: "100%",
                            backgroundColor: done || isCurrent ? tokens.accent : tokens.line,
                        }} />;
                    const label = (
                        <Typography sx={{
                            fontSize: 12,
                            fontWeight: isCurrent ? 500 : 400,
                            color: done ? tokens.accent : isCurrent ? tokens.ink : tokens.inkFaint,
                        }}>
                            {name}
                        </Typography>
                    );
                    return done && onJump
                        ? <ButtonBase
                            key={name}
                            onClick={() => onJump(i)}
                            aria-label={`Go back to ${name}`}
                            sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "7px", borderRadius: "4px" }}>
                            {bar}{label}
                        </ButtonBase>
                        : <Box key={name} sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
                            {bar}{label}
                        </Box>
                })}
            </Box>
        </Box>
    )
}

export default RegisterProgress;
