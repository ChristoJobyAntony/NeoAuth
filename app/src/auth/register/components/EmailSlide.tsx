import React, { useState } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { CarouselItem } from "../../../components/Carousel";
import { Form } from "../../types";
import api from "../../api";

type props = {
    emailField: Form,
    setEmailField: React.Dispatch<React.SetStateAction<Form>>,
    cb: () => void,
}

function EmailSlide({ emailField, setEmailField, cb }: props) {
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);

    async function updateEmailField(field: Partial<Form>) {
        setEmailField({ ...emailField, ...field })
    }

    async function onEmailInput() {
        try {
            setBusy(true);
            if (!emailField.value) throw Error("Enter an email address");
            else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField.value)) throw Error("Enter a valid email address");
            else if (await api.checkEmailExists(emailField.value)) throw Error("An account already exists for this address");
            else updateEmailField({ helperText: "", error: false });
            cb();
        } catch (e) {
            updateEmailField({ helperText: e instanceof Error ? e.message : String(e), error: true })
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
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <Typography variant="overline">
                        Create account — step 1 of 6
                    </Typography>
                    <Typography variant="h4" align="center">
                        A password made of objects
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: "normal" }}>
                        No letters, no numbers — you'll pick a sequence of objects instead.
                    </Typography>
                </div>
                <div
                    style={{
                        width: "70%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                    <TextField
                        required
                        id="auth__register__text_field_email"
                        label="Email address"
                        variant="outlined"
                        value={emailField.value}
                        helperText={emailField.helperText}
                        error={emailField.error}
                        onKeyDown={(e) => { if (e.key === "Enter") onEmailInput() }}
                        onChange={(e) => { updateEmailField({ value: e.target.value }) }}
                        style={{ width: "100%" }} />
                    <Button
                        color="primary"
                        variant="text"
                        size="small"
                        onClick={() => navigate('/auth')}
                        style={{
                            alignSelf: "start",
                            paddingInline: 0,
                            marginTop: 8,
                        }}>
                        Already have an account? Sign in
                    </Button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", paddingBottom: "10px" }}>
                    <Button
                        variant="contained"
                        disabled={busy}
                        onClick={(_) => { onEmailInput() }}>
                        Continue
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "normal", px: 3, textAlign: "center" }}>
                        Research prototype — anonymous timing data is recorded for evaluation.
                    </Typography>
                </div>
            </div>
        </CarouselItem>
    )
}

export default EmailSlide;
