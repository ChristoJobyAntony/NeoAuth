import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { CarouselItem } from "../../../components/Carousel";
import { Form } from "../../types";
import api from "../../api";

type props = {
    emailField: Form,
    setEmailField: React.Dispatch<React.SetStateAction<Form>>,
    nameField: Form,
    setNameField: React.Dispatch<React.SetStateAction<Form>>,
    cb: () => void,
}

function AccountSlide({ emailField, setEmailField, nameField, setNameField, cb }: props) {
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);

    async function onContinue() {
        let valid = true;
        if (!nameField.value) {
            setNameField({ ...nameField, helperText: "Enter a name", error: true });
            valid = false;
        } else {
            setNameField({ ...nameField, helperText: "", error: false });
        }

        if (!emailField.value) {
            setEmailField({ ...emailField, helperText: "Enter an email address", error: true });
            return;
        }
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField.value)) {
            setEmailField({ ...emailField, helperText: "Enter a valid email address", error: true });
            return;
        }
        setBusy(true);
        try {
            if (await api.checkEmailExists(emailField.value)) {
                setEmailField({ ...emailField, helperText: "An account already exists for this address", error: true });
                return;
            }
            setEmailField({ ...emailField, helperText: "", error: false });
            if (valid) cb();
        } finally {
            setBusy(false);
        }
    }

    return (
        <CarouselItem width="100%">
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center"
                }}>
                <div style={{ textAlign: "center", padding: "10px 20px 0" }}>
                    <Typography variant="h4" align="center">
                        Create your account
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: "normal", maxWidth: "46ch" }}>
                        Your email identifies you. It is not your password — the objects you choose next are.
                    </Typography>
                </div>
                <div
                    style={{
                        width: "70%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}>
                    <TextField
                        required
                        id="auth__register__text_field_name"
                        label="Name"
                        variant="outlined"
                        value={nameField.value}
                        helperText={nameField.helperText}
                        error={nameField.error}
                        onChange={(e) => { setNameField({ ...nameField, value: e.target.value }) }}
                        style={{ width: "100%" }} />
                    <TextField
                        required
                        id="auth__register__text_field_email"
                        label="Email address"
                        variant="outlined"
                        value={emailField.value}
                        helperText={emailField.helperText}
                        error={emailField.error}
                        onKeyDown={(e) => { if (e.key === "Enter") onContinue() }}
                        onChange={(e) => { setEmailField({ ...emailField, value: e.target.value }) }}
                        style={{ width: "100%" }} />
                    <Button
                        color="primary"
                        variant="text"
                        size="small"
                        onClick={() => navigate('/auth')}
                        style={{ alignSelf: "start", paddingInline: 0, marginTop: -6 }}>
                        Already have an account? Sign in
                    </Button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", paddingBottom: "8px" }}>
                    <Button
                        variant="contained"
                        disabled={busy}
                        onClick={onContinue}>
                        Continue
                    </Button>
                    <Typography variant="caption" sx={{ whiteSpace: "normal", px: 3, textAlign: "center" }}>
                        Research prototype — anonymous timing data is recorded for evaluation.
                    </Typography>
                </div>
            </div>
        </CarouselItem>
    )
}

export default AccountSlide;
