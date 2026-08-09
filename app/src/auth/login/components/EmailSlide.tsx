import React, { useState } from "react";
import { CarouselItem } from "../../../components/Carousel";
import { Form } from "../../types";
import { checkEmailExists } from "../../api"
import { Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

type props = {
    email: Form,
    setEmail: React.Dispatch<React.SetStateAction<Form>>,
    callBack: () => void
}

export function EmailSlide({ email, setEmail, callBack }: props) {

    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);

    async function updateEmail(update: Partial<Form>) {
        const newForm = { ...email, ...update }
        setEmail(newForm);
    }

    async function onEnterEmail() {
        if (!email.value) return updateEmail({ helperText: "Enter your email address", error: true })
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value)) return updateEmail({ helperText: "Enter a valid email address", error: true })
        setBusy(true);
        try {
            if (await checkEmailExists(email.value)) {
                updateEmail({ helperText: "", error: false });
                await callBack();
                return;
            }
            updateEmail({ helperText: "No account exists for this address", error: true })
        } finally {
            setBusy(false);
        }
    }

    return (
        <CarouselItem width="100%">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                }}>
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <Typography variant="overline">
                        Sign in
                    </Typography>
                    <Typography variant="h4" textAlign="center">
                        Welcome back
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: "normal" }}>
                        You'll be asked to spot each of your secret objects, in order.
                    </Typography>
                </div>

                <div
                    style={{
                        width: "70%",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <TextField
                        required
                        id="auth__login__text_field_email"
                        label="Email address"
                        variant="outlined"
                        helperText={email.helperText}
                        style={{ width: "100%" }}
                        value={email.value}
                        error={email.error}
                        onKeyDown={(e) => { if (e.key === "Enter") onEnterEmail() }}
                        onChange={(e) => { updateEmail({ value: e.target.value }); }} />
                    <Button
                        color="primary"
                        variant="text"
                        size="small"
                        onClick={() => navigate('register')}
                        style={{ alignSelf: "start", paddingInline: 0, marginTop: 8 }}>
                        Don't have an account? Create one
                    </Button>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "14px",
                        paddingBottom: "10px",
                    }}>
                    <Button
                        variant="contained"
                        disabled={busy}
                        onClick={(_) => { onEnterEmail(); }}>
                        {busy ? "Preparing your challenge…" : "Continue"}
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "normal", px: 3, textAlign: "center" }}>
                        Research prototype — anonymous timing data is recorded for evaluation.
                    </Typography>
                </div>
            </div>
        </CarouselItem>);
}

export default EmailSlide;
