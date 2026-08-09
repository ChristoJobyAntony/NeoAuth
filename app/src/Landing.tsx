import { Box, Button, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "./auth/api";
import { useAuth } from "./auth/components/AuthProvider";
import { _Object } from "./auth/types";
import { tokens } from "./theme";

const HOW_IT_WORKS = [
    {
        eyebrow: "Step one",
        title: "Pick your objects",
        body: "Six to eight from a set of forty-eight, in an order you choose. Order counts: apple then key is a different password from key then apple.",
    },
    {
        eyebrow: "Step two",
        title: "Find them again",
        body: "Each round shows sixteen images, each a jumble of three objects at odd angles. Exactly one holds the object you want. Tap it.",
    },
    {
        eyebrow: "Step three",
        title: "Nothing leaks",
        body: "A watcher sees six taps on six images. Each tap is consistent with three objects, so the sequence stays hidden.",
    },
]

const LIMITS = [
    {
        title: "It is slower than a password",
        body: "Six challenge rounds take ten to twenty seconds. That is the trade for not typing a secret.",
    },
    {
        title: "A recorded session still helps an attacker",
        body: "One observation narrows the field. Several observations of the same account narrow it much further.",
    },
    {
        title: "People pick memorable objects",
        body: "As with text passwords, real choices are not uniformly random, and the effective key space is smaller than the arithmetic suggests.",
    },
    {
        title: "It is not audited",
        body: "This is a student research prototype. Do not put a real secret behind it.",
    },
]

// The observer demo: one challenge round, second image tapped.
const DEMO_TILES = [
    { objects: ["star", "car", "fish"], tapped: false },
    { objects: ["apple", "rocket", "key"], tapped: true },
    { objects: ["fish", "key", "star"], tapped: false },
    { objects: ["car", "apple", "rocket"], tapped: false },
]
const DEMO_TRANSFORMS = [
    { top: 12, left: 14, size: 46, rotate: -22 },
    { top: 54, left: 72, size: 48, rotate: 35 },
    { top: 88, left: 16, size: 44, rotate: 160 },
]

function DemoTile({ objectUids, tapped }: { objectUids: (string | undefined)[], tapped: boolean }) {
    return (
        <Box sx={{
            position: "relative",
            width: 148,
            height: 148,
            borderRadius: "12px",
            border: tapped ? `2px solid ${tokens.accent}` : "2px solid transparent",
            backgroundColor: tokens.card,
            boxShadow: tapped ? tokens.shadow2 : tokens.shadow1,
            overflow: "hidden",
        }} aria-hidden>
            {objectUids.map((uid, i) => uid &&
                <img
                    key={i}
                    src={api.getObject(uid)}
                    width={DEMO_TRANSFORMS[i].size}
                    height={DEMO_TRANSFORMS[i].size}
                    alt=""
                    style={{
                        position: "absolute",
                        top: DEMO_TRANSFORMS[i].top,
                        left: DEMO_TRANSFORMS[i].left,
                        transform: `rotate(${DEMO_TRANSFORMS[i].rotate}deg)`,
                    }} />
            )}
            {tapped &&
                <Box sx={{
                    position: "absolute",
                    bottom: 8, left: 8, right: 8,
                    fontSize: 12,
                    color: tokens.accentDark,
                    backgroundColor: tokens.accentWash,
                    borderRadius: "8px",
                    padding: "4px 8px",
                }}>
                    tapped
                </Box>}
        </Box>
    )
}

const Landing = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [objects, setObjects] = useState<_Object[]>([]);
    const [view, setView] = useState<"watcher" | "owner">("watcher");

    useEffect(() => {
        api.getObjectsInfo()
            .then(setObjects)
            .catch(() => { /* the page still reads without the icons */ });
    }, []);

    const uidByName = (name: string) => objects.find((obj) => obj.name === name)?.uid;
    const heroObjects = objects.slice(0, 6);

    const segment = (label: string, value: "watcher" | "owner") => (
        <Button
            onClick={() => setView(value)}
            sx={{
                fontSize: 14,
                borderRadius: "9px",
                padding: "7px 16px",
                backgroundColor: view === value ? tokens.card : "transparent",
                color: view === value ? tokens.ink : tokens.inkSoft,
                boxShadow: view === value ? tokens.shadow1 : "none",
                "&:hover": { backgroundColor: view === value ? tokens.card : "transparent", color: tokens.ink },
            }}>
            {label}
        </Button>
    )

    return (
        <Box sx={{ height: "100%", overflowY: "auto" }}>
            <Box sx={{
                maxWidth: "1000px",
                margin: "0 auto",
                padding: "0 24px 96px",
                display: "flex",
                flexDirection: "column",
                gap: { xs: "64px", md: "96px" },
            }}>

                {/* Hero */}
                <Box sx={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    textAlign: "center", gap: "18px", paddingTop: "64px",
                }}>
                    <Typography variant="overline">
                        Resistant to shoulder-surfing
                    </Typography>
                    <Typography variant="h3" sx={{ fontSize: { xs: 38, md: 52 }, maxWidth: "17ch" }}>
                        Your password is a sequence of objects
                    </Typography>
                    <Typography sx={{ fontSize: 18, lineHeight: 1.55, color: tokens.inkSoft, maxWidth: "54ch" }}>
                        Choose six everyday objects and remember their order. To sign in, you find
                        each one hidden inside a crowded image. Nothing is typed, so nothing can be
                        read off your screen or your keyboard.
                    </Typography>
                    <Box sx={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                        <Button variant="contained" size="large" disabled={!!auth.token} onClick={() => navigate("/auth/register")}>
                            Try the demo
                        </Button>
                        {auth.token
                            ? <Button variant="outlined" size="large" onClick={() => navigate("/dash")}>
                                Open dashboard
                            </Button>
                            : <Button variant="outlined" size="large" onClick={() => navigate("/auth")}>
                                See a sign-in
                            </Button>}
                    </Box>
                    {heroObjects.length > 0 &&
                        <Box aria-hidden sx={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap", justifyContent: "center" }}>
                            {heroObjects.map((obj) => (
                                <Box key={obj.uid} sx={{
                                    width: 64, height: 64, borderRadius: "12px",
                                    backgroundColor: tokens.card, boxShadow: tokens.shadow1,
                                    display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 0,
                                }}>
                                    <img src={api.getObject(obj.uid)} width="34" height="34" alt="" loading="lazy" />
                                </Box>
                            ))}
                        </Box>}
                    <Typography sx={{ fontSize: 13, color: tokens.inkFaint }}>
                        One possible sequence. Yours is one of 8,835,488,640 ordered sequences.
                    </Typography>
                </Box>

                {/* How it works */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                    <Typography variant="h4" sx={{ fontSize: 30 }}>How it works</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: "20px" }}>
                        {HOW_IT_WORKS.map((step) => (
                            <Card key={step.title} sx={{ padding: "26px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <Typography variant="overline">{step.eyebrow}</Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 600 }}>{step.title}</Typography>
                                <Typography sx={{ fontSize: 15, color: tokens.inkSoft, lineHeight: 1.55 }}>{step.body}</Typography>
                            </Card>
                        ))}
                    </Box>
                </Box>

                {/* Observer demo */}
                <Card sx={{
                    boxShadow: tokens.shadow2,
                    padding: { xs: "24px", md: "40px" },
                    display: "flex", flexDirection: "column", gap: "20px",
                    alignItems: "center", textAlign: "center",
                }}>
                    <Typography variant="h4" sx={{ fontSize: 30 }}>What the person behind you sees</Typography>
                    <Typography sx={{ fontSize: 16, color: tokens.inkSoft, maxWidth: "56ch" }}>
                        This is one challenge round, tapped. Toggle what the observer knows.
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 148px)", gap: "16px", marginTop: "8px" }}>
                        {DEMO_TILES.map((tile, i) => (
                            <DemoTile key={i} objectUids={tile.objects.map(uidByName)} tapped={tile.tapped} />
                        ))}
                    </Box>
                    <Box sx={{ display: "flex", gap: "8px", backgroundColor: tokens.sunken, borderRadius: "12px", padding: "4px", marginTop: "14px" }}>
                        {segment("The observer", "watcher")}
                        {segment("You", "owner")}
                    </Box>
                    <Typography sx={{ fontSize: 15, color: tokens.inkSoft, maxWidth: "60ch", minHeight: "44px" }}>
                        {view === "watcher"
                            ? "They know you tapped the second image. It contains an apple, a rocket and a key — three candidates for this position, and they cannot tell which. Repeat that for six positions and the sequence is still hidden."
                            : "You were looking for the key. You ignored the apple and the rocket entirely; from the outside those two decisions are invisible, because you never touched them."}
                    </Typography>
                </Card>

                {/* Honest limitations */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <Typography variant="h4" sx={{ fontSize: 30 }}>What this does not claim</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: "16px" }}>
                        {LIMITS.map((limit) => (
                            <Card key={limit.title} sx={{
                                boxShadow: "none",
                                border: `1px solid ${tokens.line}`,
                                padding: "22px",
                                display: "flex", flexDirection: "column", gap: "6px",
                            }}>
                                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{limit.title}</Typography>
                                <Typography sx={{ fontSize: 15, color: tokens.inkSoft, lineHeight: 1.55 }}>{limit.body}</Typography>
                            </Card>
                        ))}
                    </Box>
                </Box>

                {/* Footer */}
                <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    flexWrap: "wrap", gap: "16px",
                    borderTop: `1px solid ${tokens.line}`, paddingTop: "28px",
                }}>
                    <Typography sx={{ fontSize: 14, color: tokens.inkFaint }}>
                        COMP4500 research prototype · Australian National University · anonymous timing data recorded for evaluation
                    </Typography>
                </Box>

            </Box>
        </Box>
    )
}

export default Landing;
