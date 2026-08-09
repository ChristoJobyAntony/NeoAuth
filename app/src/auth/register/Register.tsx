import React, { useState } from "react";
import { useSnackbar } from "notistack";

import { Carousel } from "../../components/Carousel";
import EmailSlide from "./components/EmailSlide";
import DetailsSlide from "./components/DetailsSlide";
import NeoPassSlide from "./components/NeoPassSlide";
import InfoSlide from "./components/InfoSlide";
import ReviewSlide from "./components/ReviewSlide";
import SuccessSlide from "./components/SuccessSlide";
import api from "../api";
import { Form, _Object } from "../types";
import { logEvent, startTimer } from "../../metrics";

const defaultTextField: Form = { value: "", error: false, helperText: "" };

const Register = () => {

    let [slide, setSlide] = useState(0);
    const [objects, setObjects] = useState<_Object[]>([]);
    const [nameField, setNameField] = useState(defaultTextField);
    const [emailField, setEmailField] = useState(defaultTextField);
    const [neoPass, setNeoPass] = useState<_Object[]>([]);
    const [registerTimer, setRegisterTimer] = useState<(() => number) | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    async function fetchObjects() {
        try {
            setObjects(await api.getObjectsInfo());
        } catch (e) {
            enqueueSnackbar("Couldn't load the object library — please refresh", { variant: "error" });
        }
    }

    function onNeoPassSelect(selectedObjects: _Object[]) {
        setNeoPass([...selectedObjects]);
        nextSlide();
    }

    function onNeoPassConfirm(selectedObjects: _Object[]) {
        const check = selectedObjects.map((obj, i) => obj.uid === neoPass[i]?.uid)

        if (check.length === neoPass.length && !check.includes(false)) {
            enqueueSnackbar("Sequence confirmed", { variant: "success" });
            return setSlide(5);
        };
        logEvent("register_mismatch");
        setSlide(3);
        enqueueSnackbar("The sequences don't match — try selecting again", { variant: 'error' })
    }

    async function registerUser() {
        try {
            await api.registerUser(
                nameField.value,
                emailField.value,
                neoPass);
            if (registerTimer) logEvent("register_complete", registerTimer(), { length: neoPass.length });
            enqueueSnackbar("Account created", { variant: "success" })
            setSlide(6);
        } catch (e) {
            enqueueSnackbar("Registration failed — please review your details", { variant: "error" })
        }
    }

    function nextSlide() { setSlide(slide + 1) }

    function prevSlide() { setSlide(slide - 1) }


    return (
        <Carousel
            activeIndex={slide}
            style={{
                height: "100%",
                width: "100%",
                borderRadius: "14px",
            }}>

            <EmailSlide
                emailField={emailField}
                setEmailField={setEmailField}
                cb={() => {
                    setRegisterTimer(() => startTimer());
                    logEvent("register_start");
                    nextSlide();
                    fetchObjects();
                }} />

            <DetailsSlide
                nameField={nameField}
                setNameField={setNameField}
                onPrev={prevSlide}
                onNext={nextSlide} />

            <InfoSlide
                onPrev={prevSlide}
                onNext={nextSlide} />

            <NeoPassSlide
                step={4}
                prompt="Choose your secret objects"
                hint="Pick 6 to 8 objects — the order you pick them is part of your NeoPass."
                objects={objects}
                onPrev={prevSlide}
                onNext={onNeoPassSelect} />

            <NeoPassSlide
                step={5}
                prompt="Repeat your sequence"
                hint="Select the same objects again, in the same order."
                objects={objects}
                onPrev={prevSlide}
                onNext={onNeoPassConfirm} />

            <ReviewSlide
                setSlide={setSlide}
                onPrev={prevSlide}
                onNext={registerUser} />

            <SuccessSlide />

        </Carousel>
    )
}

export default Register
