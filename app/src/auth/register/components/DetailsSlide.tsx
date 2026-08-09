import React from "react";
import { Button, TextField, Typography } from "@mui/material";

import { CarouselItem } from "../../../components/Carousel";
import { Form } from "../../types";

type props = {
    nameField: Form,
    setNameField: React.Dispatch<React.SetStateAction<Form>>,
    onPrev: () => void,
    onNext: () => void,
}

function DetailsSlide({ nameField, setNameField, onPrev, onNext }: props) {

    function updateNameField(field: Partial<Form>) {
        setNameField({ ...nameField, ...field })
    }

    function onNameInput() {
        if (!nameField.value) return updateNameField({ helperText: "Enter a name", error: true });
        updateNameField({ helperText: "", error: false });
        onNext();
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
                    alignItems: "center",
                }}>
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <Typography variant="overline">
                        Create account — step 2 of 6
                    </Typography>
                    <Typography variant="h4" align="center">
                        What should we call you?
                    </Typography>
                </div>

                <div style={{ width: "70%" }}>
                    <TextField
                        required
                        id="auth__register__text_field_name"
                        label="Name"
                        variant="outlined"
                        value={nameField.value}
                        helperText={nameField.helperText}
                        error={nameField.error}
                        onKeyDown={(e) => { if (e.key === "Enter") onNameInput() }}
                        onChange={(e) => { updateNameField({ value: e.target.value }) }}
                        style={{ width: "100%" }} />
                </div>

                <div
                    style={{
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Button variant="text" onClick={onPrev}>
                        Back
                    </Button>
                    <Button variant="contained" onClick={onNameInput}>
                        Continue
                    </Button>
                </div>
            </div>
        </CarouselItem>
    )
}

export default DetailsSlide
