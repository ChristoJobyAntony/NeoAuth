import React from "react";
import { CarouselItem } from "../../../components/Carousel";
import { Form } from "../../types";
import {checkEmailExists} from "../../api"
import { Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

type props = {
    email: Form, 
    setEmail: React.Dispatch<React.SetStateAction<Form>>,
    callBack: () => void
}

export function EmailSlide(  {email, setEmail, callBack} : props  ) {
    
    const navigate = useNavigate();
    
    async function updateEmail ( update : Partial<Form>) {
        const newForm = {...email, ...update}
        setEmail(newForm);
    }

    async function onEnterEmail() {
        if ( ! email.value ) return updateEmail({helperText: "Please enter a value", error: true})
        if ( ! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value) ) return updateEmail({helperText : "Please enter a valid email", error: true})
        if(await checkEmailExists(email.value)) {
            callBack();
            return;
        }
        else { updateEmail({helperText: "Email address not found !", error: true}) }
    }
    
    
    return (
    <CarouselItem  width="100%">
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "space-evenly",
            }}>
            <div
                style={{
                    flex: "0 0",
                    display: "flex",
                    alignItems: "center",
                    padding: "20px"
                }}>
                <Typography variant="h4" flexGrow={1} textAlign="center">
                    Hey there 👋 <br /> Welcome Back 🙌
                </Typography>
            </div>

            <div
                style={{
                    flex: "2 0",
                    width: "70%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                <Typography variant="subtitle1">
                    Enter your email address 📧
                </Typography>
                <br />
                <TextField
                    required
                    id="auth__login__text_field_email"
                    label="Email Address"
                    variant="outlined"
                    helperText={email.helperText}
                    style={{ width: "100%" }}
                    value={email.value}
                    error={email.error}
                    onChange={(e) => { updateEmail({ value: e.target.value }); } } />
                <Button
                    color="secondary"
                    variant="text"
                    size="small"
                    onClick={() => navigate('register')}
                    style={{
                        alignSelf: "start",
                        padding: "10px"
                    }}>
                    Dont have an account?
                </Button>
            </div>


            <div
                style={{
                    flex: "1 0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center"
                }}>

                <Button
                    variant="outlined"
                    sx={{ flexShrink: 0 }}
                    onClick={(_) => { onEnterEmail(); } }>
                    Next
                </Button>

            </div>

        </div>
    </CarouselItem>);
}


export default EmailSlide;