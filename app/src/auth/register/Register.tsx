import React, { useState } from "react";
import { useSnackbar } from "notistack";

import { Carousel } from "../../components/Carousel";
import AccountSlide from "./components/AccountSlide";
import NeoPassSlide from "./components/NeoPassSlide";
import RegisterProgress from "./components/RegisterProgress";
import ReviewSlide from "./components/ReviewSlide";
import SuccessSlide from "./components/SuccessSlide";
import api from "../api";
import { Form, _Object } from "../types";
import { logEvent, startTimer } from "../../metrics";

const defaultTextField: Form = { value: "", error: false, helperText: "" };

const STEPS = ["Account", "Choose objects", "Confirm", "Review"];
// slide indices: 0 account, 1 choose, 2 confirm, 3 review, 4 success

const Register = () => {

    let [slide, setSlide] = useState(0);
    const [objects, setObjects] = useState<_Object[]>([]);
    const [nameField, setNameField] = useState(defaultTextField);
    const [emailField, setEmailField] = useState(defaultTextField);
    const [neoPass, setNeoPass] = useState<_Object[]>([]);
    const [pickCount, setPickCount] = useState(0);
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
        setSlide(2);
    }

    function onNeoPassConfirm(selectedObjects: _Object[]) {
        const check = selectedObjects.map((obj, i) => obj.uid === neoPass[i]?.uid)

        if (check.length === neoPass.length && !check.includes(false)) {
            enqueueSnackbar("Sequence confirmed", { variant: "success" });
            return setSlide(3);
        };
        logEvent("register_mismatch");
        setSlide(1);
        enqueueSnackbar("That wasn't the same sequence — try selecting again", { variant: 'error' })
    }

    async function registerUser() {
        try {
            await api.registerUser(
                nameField.value,
                emailField.value,
                neoPass);
            if (registerTimer) logEvent("register_complete", registerTimer(), { length: neoPass.length });
            enqueueSnackbar("Account created", { variant: "success" })
            setSlide(4);
        } catch (e) {
            enqueueSnackbar("Registration failed — please review your details", { variant: "error" })
        }
    }

    // Which progress segment is live, and the sub-label under the bar.
    const progressStep = slide >= 4 ? STEPS.length : slide;
    const progressDetail =
        slide === 0 ? "Your details"
            : slide === 1 ? (pickCount >= 8 ? "8 of 8 — continue" : `Object ${pickCount + 1} — pick 6 to 8`)
                : slide === 2 ? `Object ${Math.min(pickCount + 1, neoPass.length)} of ${neoPass.length} — re-entering`
                    : slide === 3 ? "Final check"
                        : "Complete";

    // The progress bar is the back-navigation: completed segments jump.
    function jumpTo(step: number) {
        if (slide >= 4) return; // done — nothing to edit
        setSlide(step);
    }

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff", borderRadius: "14px", overflow: "hidden" }}>
            <RegisterProgress
                steps={STEPS}
                current={progressStep}
                detail={progressDetail}
                onJump={slide < 4 ? jumpTo : undefined} />
            <div style={{ flex: "1 1 0", minHeight: 0 }}>
                <Carousel
                    activeIndex={slide}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}>

                    <AccountSlide
                        emailField={emailField}
                        setEmailField={setEmailField}
                        nameField={nameField}
                        setNameField={setNameField}
                        cb={() => {
                            setRegisterTimer(() => startTimer());
                            logEvent("register_start");
                            setSlide(1);
                            fetchObjects();
                        }} />

                    <NeoPassSlide
                        mode="choose"
                        prompt="Choose your objects, in order"
                        hint="Order matters — apple then key is a different password from key then apple. Pick 6 to 8."
                        objects={objects}
                        onCountChange={setPickCount}
                        onNext={onNeoPassSelect} />

                    <NeoPassSlide
                        mode="confirm"
                        prompt="Enter it again to confirm"
                        hint="Repeat your sequence from memory. Your entries stay masked — the real sign-in never echoes them back either."
                        objects={objects}
                        targetLength={neoPass.length}
                        onCountChange={setPickCount}
                        onNext={onNeoPassConfirm} />

                    <ReviewSlide
                        setSlide={setSlide}
                        onNext={registerUser} />

                    <SuccessSlide />

                </Carousel>
            </div>
        </div>
    )
}

export default Register
