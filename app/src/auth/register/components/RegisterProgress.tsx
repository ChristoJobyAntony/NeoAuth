import { Box, ButtonBase, Typography } from "@mui/material";
import React from "react";

import { tokens } from "../../../theme";

type props = {
    steps: string[],
    current: number,          // index into steps; steps.length == everything done
    detail?: string,          // uppercase sub-label under the bar
    onJump?: (step: number) => void,  // navigate back via a completed segment
}

// The universal progress bar from the sign-up prototype: one segment per
// step, the bar itself is the navigation — completed segments are buttons.
function RegisterProgress({ steps, current, detail, onJump }: props) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "22px 24px 4px" }}>
            <Box sx={{ display: "flex", gap: "8px", width: "100%", maxWidth: "520px" }}>
                {steps.map((name, i) => {
                    const done = i < current;
                    const isCurrent = i === current;
                    const bar = (
                        <Box sx={{
                            height: "4px",
                            borderRadius: "2px",
                            width: "100%",
                            backgroundColor: done || isCurrent ? tokens.accent : tokens.line,
                        }} />
                    );
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
            <Typography variant="overline" sx={{ minHeight: "22px" }}>
                {detail ?? ""}
            </Typography>
        </Box>
    )
}

export default RegisterProgress;
