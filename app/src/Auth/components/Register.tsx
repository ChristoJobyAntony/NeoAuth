import React, { useState } from "react";
import { Typography, TextField, Button, Tooltip, Stepper, Step, StepLabel, Card } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";

import {Carousel, CarouselItem} from "../../components/Carousel";
import api from "../api";



const MAX_OBJECTS = 8;
const MIN_OBJECTS = 4;
const defaultTextField : textFieldProps = { value: "", error: false, helperText: "" };
const defaultSelectedObjects = [undefined, undefined, undefined, undefined];

type textFieldProps = {
    value : string,
    error : boolean,
    helperText : string
}

type Object = {
    uid : string,
    name : string
}

type Step = {
    label : string,
    slide : number
}

const steps : Step[]= [
    {
        label : "Configure Email 📧",
        slide : 0
    },{
        label : "Some Specifics 📋",
        slide : 1
    }, {
        label : "Set-up Neo Pass 🛡️",
        slide : 3
    },{
        label : "Register 🚀 ",
        slide : 5
    }
]

const Register = () => {

    let navigate = useNavigate();
    let [slide, setSlide] = useState(0);
    const [progressStep, setProgressStep] = useState(0);
    const [objects, setObjects] = useState<Object[]>([]);
    const [nameField, setNameField] = useState(defaultTextField);
    const [emailField, setEmailField] = useState(defaultTextField);
    const [selectedObjects, setSelectedObjects] = useState<(Object|undefined)[]>(defaultSelectedObjects);
    const [objectCounter, setObjectCounter] = useState<number>(0);
    const [neoPass, setNeoPass] = useState<Object[]>([]);
    const  { enqueueSnackbar, closeSnackbar } = useSnackbar();

    async function updateNameField (field : Partial<textFieldProps>) {
        setNameField({...nameField, ...field})
    }

    async function updateEmailField  (field : Partial<textFieldProps>){
        setEmailField({...emailField, ...field})
    }

    async function onEmailInput () {
        try{
            if (!emailField.value) throw Error("Textfield is empty");
            else if ( ! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailField.value) ) throw Error("Invalid Email");
            else if (await api.checkEmailExists(emailField.value)) throw Error("Email is already in use");
            else updateEmailField({helperText:undefined, error: false})
            api.getObjectsInfo()
            .then((objects) =>  setObjects(objects!))
            .catch((e) => console.log("Error in fetching objects !"));
            return setSlide(1)
        }catch (e){
            updateEmailField({helperText: String(e), error : true})
        }
    }
    
    async function onSelectObject (obj : Object) {
        if (objectCounter+1 === MAX_OBJECTS) return enqueueSnackbar(`You can only select upto ${MAX_OBJECTS} `, {variant : "error"})
        const update = selectedObjects.slice();
        update[objectCounter] = obj;
        setSelectedObjects(update);
        setObjectCounter(objectCounter+1);
    }

    async function resetObjectSelection () {
        setSelectedObjects(defaultSelectedObjects);
        setObjectCounter(0);
    }

    async function onNeoPassSelect() {
        const secretObjects = []
        for (const obj of selectedObjects) {
            if (obj) secretObjects.push(obj);
        }
        console.log(selectedObjects);
        console.log(secretObjects);
        
        
        setNeoPass([...secretObjects]);
        resetObjectSelection();
        setSlide(4);
    }

    async function registerUser () {
        try {
            const user = await api.registerUser(
            nameField.value, 
            emailField.value,
            neoPass);
            enqueueSnackbar("Registration Successful", {variant: "success"})
            setSlide(6);
        }catch(e){

        }
    }

    async function onNeoPassConfirm() {
        const check = selectedObjects.map((obj, i) => obj?.uid === neoPass[i]?.uid )
        resetObjectSelection();

        if ( check.length === neoPass.length && !check.includes(false) ) {
            resetObjectSelection();
            enqueueSnackbar("NeoPass has been setup successfully", {variant: "success"});
            setProgressStep(3);
            return setSlide(5);
        };
        setSlide(3);
        return enqueueSnackbar(`The objects do not match !`, {variant : 'error'})
    }


    return (
        <Carousel 
            activeIndex={slide}
            style={{
                height: "100%",
                width: "100%",
                borderRadius : "10px",
            }}>

            <CarouselItem key="auth__register_carousel_item__email">
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
                            <Typography variant="h5" align="center">
                                Hello 👋<br/> 
                                This is the start 🚦 of your upgraded security 
                            </Typography>
                    </div>
                    <div
                        style={{
                            flex:"2 0",
                            width:"70%"
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

            <CarouselItem key="auth__register__carousel_item__name">
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
                        <Typography variant="h5" align="center">
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
                            onClick={(_)=>{
                                setSlide(0)
                            }}>
                            Back
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={(_)=>{
                                console.log(nameField.value);
                                if (Boolean(!nameField.value)) return updateNameField({helperText:"Textfield is empty", error: true})
                                else updateNameField({helperText : "", error: false})
                                setSlide(2)
                            }}>
                            Next
                        </Button>
                    </div>

                </div>
            </CarouselItem>

            <CarouselItem key="auth__register__carousel_item__helper_1">
                <div
                    style={{
                        width:"100%",
                        height:"100%",
                        display:"flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly", 
                        alignItems: "center",
                    }}>
                    
                    <div 
                        style={{
                            flexGrow: 1,
                            padding: "20px"
                        }}>
                        <Typography variant="h5" align="center" whiteSpace="normal">
                            Hey {nameField.value}, Just a a short note 📑
                        </Typography>

                    </div>

                    <div
                        style={{
                            flexGrow: 3,
                            width:"90%"
                        }}>

                        <Typography 
                            variant="body1"
                            whiteSpace="normal">

                            Now we are gonna set up your NeoPass.
                            <ul>
                            <li>A NeoPass consists of 4 - 8 objects in a specific order.</li>
                            <li>You can select the same object twice but not consequently.</li>
                            <li>These objects will be the password for all you future login attempts. </li>   
                            </ul>                         
                            Best of luck 👍
                            

                        </Typography>
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
                            onClick={(_)=>{
                                setSlide(1)
                            }}>
                            Back
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={(_)=>{
                                setSlide(3)
                            }}>
                            NExt
                        </Button>
                    </div>


                </div>
            </CarouselItem>

            <CarouselItem key={`auth__register__carousel_item_neo_pass`}>
                <div
                    style={{
                        width : "100%",
                        height: "100%",
                        display : "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }}>
                    
                    <div
                        style={{
                            flex: "0 0",
                            padding: "20px",
                            display: "flex"
                        }}>
                            <Typography variant="h5">
                                Select your secret objects 🤫
                            </Typography>
                    </div>

                    <Card
                        sx={{
                            flex:"4 0",
                            width:"95%",
                            overflowY:"scroll",
                            scrollbarWidth: "thin",
                            display: "grid",
                            gridTemplateColumns: "auto auto auto auto auto",
                            rowGap: "5px",
                            columnGap: "5px",
                            border : '2px solid',
                            borderColor : 'primary.main',
                            padding:"5px",
                        }}>
                        
                        {
                            objects.map((obj, j)=>
                                <Tooltip 
                                    title={obj.name}
                                    key={`auth__register__tooltip__object_${j}`}>
                                    <Button
                                        variant="outlined"
                                        onClick={(_)=>onSelectObject(obj)}
                                        disabled={selectedObjects[objectCounter-1]?.uid === obj.uid }>
                                            <img
                                                placeholder="http://placehold.jp/200x200.png"
                                                width="100%" 
                                                src={api.getObject(obj.uid)} 
                                                alt={obj.name} 
                                                />
                                    </Button>
                               </Tooltip>
                            )
                        }

                    </Card>

                    <div
                        style={{
                            flex : "1 0",
                            padding: "10px",
                            width: "95%",
                        }}>
                            <Stepper activeStep={objectCounter} alternativeLabel>
                                {selectedObjects.map((obj, i) => (
                                    <Step key={`auth__register__stepper_step_${i}`}>
                                        <StepLabel>{obj ? obj.name : `Object ${i+1}` }</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                    </div>

                    <div
                        style={{
                            flex : "1 0",
                            padding : "10px",
                            display : "flex",
                            justifyContent : "space-between",
                            width : "90%",
                        }}>
                            <Button
                                onClick={(_)=>setSlide(2)}>
                                Back
                            </Button>
                            <Button
                                disabled={objectCounter == 0 }
                                onClick={(_)=> resetObjectSelection()}>
                                Reset
                            </Button>
                            <Button
                                disabled={objectCounter < MIN_OBJECTS}
                                onClick={(_) => onNeoPassSelect()}>
                                Next
                            </Button>
                    </div>
                </div>
            </CarouselItem>
            
            <CarouselItem key={`auth__register__carousel_item_confirm_neo_pass`}>
                <div
                    style={{
                        width : "100%",
                        height: "100%",
                        display : "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }}>
                    
                    <div
                        style={{
                            flex: "0 0",
                            padding: "20px",
                            display: "flex"
                        }}>
                            <Typography variant="h5">
                                Reselect you secret objects 🧠
                            </Typography>
                    </div>

                    <Card
                        sx={{
                            flex:" 3 0",
                            width:"95%",
                            overflowY:"scroll",
                            scrollbarWidth: "thin",
                            display: "grid",
                            gridTemplateColumns: "auto auto auto auto auto",
                            rowGap: "5px",
                            columnGap: "5px",
                            border : '2px solid',
                            borderColor : 'primary.main',
                            padding:"5px",
                        }}>
                        
                        {
                            objects.map((obj, j)=>
                                <Tooltip 
                                    title={obj.name}
                                    key={`auth__register__tooltip__object_${j}`}>
                                    <Button
                                        variant="outlined"
                                        onClick={(_)=>onSelectObject(obj)}
                                        disabled={selectedObjects[objectCounter-1]?.uid === obj.uid }>
                                            <img
                                                placeholder="http://placehold.jp/200x200.png"
                                                width="100%" 
                                                src={api.getObject(obj.uid)} 
                                                alt={obj.name} 
                                                loading= "lazy"
                                                />
                                    </Button>
                               </Tooltip>
                            )
                        }

                    </Card>

                    <div
                        style={{
                            flex : "1 0",
                            padding: "10px",
                            width: "95%",
                        }}>
                            <Stepper activeStep={objectCounter} alternativeLabel>
                                {selectedObjects.map((obj, i) => (
                                    <Step key={`auth__register__stepper_step_${i}`}>
                                        <StepLabel>{obj ? obj.name : `Object ${i+1}` }</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                    </div>

                    <div
                        style={{
                            flex : "1 0",
                            padding : "10px",
                            display : "flex",
                            justifyContent : "space-between",
                            width : "90%",
                        }}>
                            <Button
                                onClick={(_)=>setSlide(3)}>
                                Back
                            </Button>
                            <Button
                                disabled={objectCounter == 0 }
                                onClick={(_)=> resetObjectSelection()}>
                                Reset
                            </Button>
                            <Button
                                disabled={objectCounter < MIN_OBJECTS}
                                onClick={(_) => onNeoPassConfirm()}>
                                Next
                            </Button>
                    </div>
                </div>
            </CarouselItem>

            <CarouselItem key="auth__register__carousel_item__preview">
                <div
                    style={{
                        width:"100%",
                        height:"100%",
                        display:"flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly", 
                        alignItems: "center",
                    }}>
                    
                    <div 
                        style={{
                            flex: "0 0",
                            padding: "20px"
                        }}>
                        <Typography variant="h5" align="center" whiteSpace="normal">
                            A final review before we make things final 👓
                        </Typography>

                    </div>

                    <div
                        style={{
                            flex: "2 0",
                            width:"90%",
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "center"
                        }}>

                        <Stepper
                            activeStep={progressStep}
                            orientation="vertical">
                            {
                                steps.map(step => 
                                        <Step key={step.label}>
                                            <StepLabel>
                                                <Button
                                                    onClick={()=>setSlide(step.slide)}>
                                                    {step.label}
                                                </Button>
                                            </StepLabel>
                                        </Step> 
                                    )
                            }

                        </Stepper>
                    </div>
                        
                    <div
                        style={{
                            flex: "1 0",
                            width: "90%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        
                        <Button
                            variant="outlined"
                            onClick={ () => registerUser() }>
                            Register
                        </Button>
                    </div>


                </div>
            </CarouselItem>

            <CarouselItem key="auth__register__carousel_item_success">
                <div
                    style={{
                        width:"100%",
                        height:"100%",
                        display:"flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly", 
                        alignItems: "center",
                    }}>
                    
                    <div 
                        style={{
                            flex: "0 0",
                            padding: "20px"
                        }}>
                        <Typography variant="h5" align="center" whiteSpace="normal">
                            Great Job 🎉 🥳, Your all done 👍
                        </Typography>

                    </div>

                    <div
                        style={{
                            flex: "2 0",
                            width:"90%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-evenly"
                        }}>

                            <CheckCircleOutlineOutlinedIcon fontSize="large" color="success"/>
                            <Typography variant="h6" whiteSpace='normal' textAlign='center'>
                                You have been successfully registered with NeoAuth <SecurityOutlinedIcon/>. <br/>
                                Welcome to the future of secure and effortless authentication.
                            </Typography>

                        
                    </div>
                        
                    <div
                        style={{
                            flex: "1 0",
                            width: "90%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        
                        <Button
                            variant="outlined"
                            onClick={()=>{
                                enqueueSnackbar('Login using your the credentials you created', {variant : "info"});
                                navigate('/auth')
                            }}>
                            Login to you account
                        </Button>
                    </div>


                </div>
            </CarouselItem>
        
            
            
        </Carousel>
    )
}

export default Register