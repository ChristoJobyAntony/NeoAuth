import { Details } from "@mui/icons-material";
import { TextField, Typography, Button} from "@mui/material";
import React from "react";
import { CarouselItem } from "../../../components/Carousel";
import { Form } from "../../types";

type props = {
    nameField : Form,
    setNameField : React.Dispatch<React.SetStateAction<Form>>,
    onPrev : () => void,
    onNext : () => void,

}
function DetailsSlide ({nameField, setNameField, onPrev, onNext} : props) {
    
    function updateNameField (field : Partial<Form>) {
        setNameField({...nameField, ...field})
    }
    function onNameInput ( ) {
        if (Boolean(!nameField.value)) return updateNameField({helperText:"Textfield is empty", error: true});
        else updateNameField({helperText : "", error: false});
        onNext();
    }
    
    return (
    <CarouselItem width="100%">
        <div
            style={{
                width:"100%",
                height:"100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center"
            }}
        >
            <div 
                style={{
                    flexGrow: 1,
                    padding: "20px"
                }}>
                <Typography variant="h4" align="center">
                    Lets sort out some of the specifics 📋
                </Typography>

            </div>

            <div
                style={{
                    flexGrow: 3,
                    width:"70%"
                }}
            >
                <Typography variant="subtitle1">
                    What should we call you ? 🤔
                </Typography>
                <br/>
                <TextField
                    required
                    id="auth__register__text_field_name"
                    label="Name"
                    variant="outlined"
                    value={nameField.value}
                    helperText={nameField.helperText}
                    error={nameField.error}
                    onChange={(e)=>{updateNameField({value: e.target.value})}}
                    style={{width:"100%"}}/>
            </div>

            <div
                style={{
                    flexGrow: 1,
                    width: "90%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                
                <Button
                    variant="outlined"
                    onClick={onPrev}>
                    Back
                </Button>

                <Button
                    variant="outlined"
                    onClick={onNameInput}>
                    Next
                </Button>
            </div>

        </div>
    </CarouselItem>
    )
}

export default DetailsSlide