import React from "react";
import { Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


import { CarouselItem } from "../../../components/Carousel";
import { Form } from "../../types";
import api from "../../api";

type props = {
    emailField : Form,
    setEmailField : React.Dispatch<React.SetStateAction<Form>>,
    cb : () => void,
}

function EmailSlide ({emailField, setEmailField, cb} : props) {
    const navigate = useNavigate();
    
    async function updateEmailField  (field : Partial<Form>){
        setEmailField({...emailField, ...field})
    }

    async function onEmailInput () {
        try{
            if (!emailField.value) throw Error("Textfield is empty");
            else if ( ! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField.value) ) throw Error("Invalid Email");
            else if (await api.checkEmailExists(emailField.value)) throw Error("Email is already in use");
            else updateEmailField({helperText:undefined, error: false});
            cb();
            // api.getObjectsInfo()
            // .then((objects) =>  setObjects(objects!))
            // .catch((e) => console.log("Error in fetching objects !"));
            // return setSlide(1)
        }catch (e){
            updateEmailField({helperText: String(e), error : true})
        }
    }


    return (
        <CarouselItem width="100%">
                <div 
                    style={{
                        width:"100%",
                        height:"100%",
                        display:"flex",
                        flexDirection:"column",
                        justifyContent: "space-evenly",
                        alignItems: "center"
                    }}>
                    <div
                        style={{
                            flex:"1 0",
                            padding: "20px"
                        }}>
                            <Typography variant="h4" align="center">
                                Hello 👋<br/> 
                                This is the start 🚦 of your upgraded security 
                            </Typography>
                    </div>
                    <div
                        style={{
                            flex:"2 0",
                            width:"70%",
                            display:"flex",
                            flexDirection:"column",
                            justifyContent:"center"
                        }}>
                            <Typography variant="subtitle1">
                                Enter you email id 📧
                            </Typography>
                            <br/>
                            <TextField
                                required
                                id="auth__register__text_field_email"
                                label="Email"
                                variant="outlined"
                                value={emailField.value}
                                helperText={emailField.helperText}
                                error={emailField.error}
                                onChange={(e) => {updateEmailField({value : e.target.value})}}
                                style={{width:"100%"}}/>
                            <Button
                                color="secondary"
                                variant="text"
                                size="small"
                                onClick={()=>navigate('/auth')}
                                style={{
                                    alignSelf:"start",
                                    padding:"10px"
                                }}>
                                Already have an account ? 
                            </Button>
                    </div>

                    <div
                        style={{
                            flex:"1 0"
                        }}>
                        <Button
                            variant="outlined"
                            onClick={(_)=>{onEmailInput()}}>
                            Next
                        </Button>
                    </div>
                </div>
            </CarouselItem>
    )
}

export default EmailSlide;
