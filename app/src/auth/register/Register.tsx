import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import {Carousel} from "../../components/Carousel";
import EmailSlide from "./components/EmailSlide";
import DetailsSlide from "./components/DetailsSlide";
import NeoPassSlide from "./components/NeoPassSlide";
import InfoSlide from "./components/InfoSlide";
import ReviewSlide from "./components/ReviewSlide";
import SuccessSlide from "./components/SuccessSlide";
import api from "../api";
import {Form, _Object} from "../types";


const MAX_OBJECTS = 8;
const MIN_OBJECTS = 4;
const defaultTextField : Form = { value: "", error: false, helperText: "" };
const defaultSelectedObjects = [undefined, undefined, undefined, undefined];


const Register = () => {

    let [slide, setSlide] = useState(0);
    const [objects, setObjects] = useState<_Object[]>([]);
    const [nameField, setNameField] = useState(defaultTextField);
    const [emailField, setEmailField] = useState(defaultTextField);
    const [neoPass, setNeoPass] = useState<_Object[]>([]);
    const  { enqueueSnackbar } = useSnackbar();

    

    async function fetchObjects () {
        try {
            setObjects(await api.getObjectsInfo());
        }catch (e){
            enqueueSnackbar('Error fetching objects : ${e}');
        }
    }
    
    function onNeoPassSelect(selectedObjects : _Object[]) {
        setNeoPass([...selectedObjects]);
        nextSlide();
    }

    function onNeoPassConfirm(selectedObjects : _Object[]) {
        const check = selectedObjects.map((obj, i) => obj.uid === neoPass[i]?.uid )
        
        if ( check.length === neoPass.length && !check.includes(false) ) {
            enqueueSnackbar("NeoPass has been setup successfully", {variant: "success"});
            return setSlide(5);
        };
        setSlide(3);
        enqueueSnackbar(`The objects do not match !`, {variant : 'error'})
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

    function nextSlide () {setSlide(slide + 1)}

    function prevSlide () {setSlide(slide - 1)}


    return (
    <Carousel
    activeIndex={slide}
    style={{
        height: "100%",
        width: "100%",
        borderRadius : "10px",
    }}>

        <EmailSlide 
        emailField={emailField}
        setEmailField={setEmailField}
        cb={()=> {
            nextSlide();
            fetchObjects();
        }}/>

        <DetailsSlide 
        nameField={nameField}
        setNameField={setNameField}
        onPrev={prevSlide}
        onNext={nextSlide}/>

        <InfoSlide 
        onPrev={prevSlide}
        onNext={nextSlide}/>

        <NeoPassSlide
        prompt="Select your secret objects 🤫"
        objects={objects}
        onPrev={prevSlide}
        onNext={onNeoPassSelect}/>

        <NeoPassSlide
        prompt="Reselect you secret objects 🧠"
        objects={objects}
        onPrev={prevSlide}
        onNext={onNeoPassConfirm}/>  

        <ReviewSlide 
        setSlide={setSlide}
        onPrev={prevSlide}
        onNext={registerUser}/>
        

        <SuccessSlide />
        
    
        
        
    </Carousel>
    )
}

export default Register