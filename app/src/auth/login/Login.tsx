import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import { Carousel } from "../../components/Carousel"
import ChallengeSlide from "./components/ChallengeSlide";
import EmailSlide from "./components/EmailSlide";
import { getChallenge } from "../api";
import { useAuth } from "../components/AuthProvider";
import { Form, Image, ServerChallenge } from "../types";
import { logEvent, startTimer } from "../../metrics";

const MIN_ANSWERS = 6;

function Login() {
    const navigate = useNavigate();
    const auth = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [slide, setSlide] = useState<number>(0);
    const [challenge, setChallenge] = useState<ServerChallenge | null>(null);
    const [selections, setSelections] = useState<(Image | undefined)[]>([]);
    const [loginTimer, setLoginTimer] = useState<(() => number) | null>(null);
    const [answerTimer, setAnswerTimer] = useState<(() => number) | null>(null);
    const [email, setEmail] = useState<Form>({
        value: "",
        helperText: "",
        error: false
    });

    async function startChallenge() {
        try {
            const fresh = await getChallenge(email.value);
            setChallenge(fresh);
            setSelections(new Array(fresh.image_sets.length).fill(undefined));
            setSlide(1);
            setLoginTimer(() => startTimer());
            setAnswerTimer(() => startTimer());
            logEvent("login_start");
        } catch (e) {
            enqueueSnackbar("Could not start a sign-in challenge — please try again", { variant: "error" });
        }
    }

    function selectImage(index: number, image: Image) {
        const update = selections.slice();
        update[index] = image;
        setSelections(update);
    }

    function answeredCount() {
        let count = 0;
        while (count < selections.length && selections[count]) count++;
        return count;
    }

    function onNext(index: number) {
        if (!selections[index]) return enqueueSnackbar("Select an image first", { variant: "error" })
        if (answerTimer) logEvent("challenge_answer", answerTimer(), { index });
        setAnswerTimer(() => startTimer());
        setSlide(index + 2);
    }

    async function resetAttempt() {
        setChallenge(null);
        setSelections([]);
        setSlide(0);
    }

    async function onLogin(index: number) {
        if (!selections[index]) return enqueueSnackbar("Select an image first", { variant: "error" })
        if (answerTimer) logEvent("challenge_answer", answerTimer(), { index });
        const images = selections.slice(0, index + 1).map((image) => image!.uid);

        try {
            await auth.signIn(email.value, challenge!.uid, images);
            if (loginTimer) logEvent("login_success", loginTimer(), { answers: images.length });
            enqueueSnackbar("Signed in", { variant: "success" });
            navigate("/dash");
        } catch (e) {
            if (loginTimer) logEvent("login_fail", loginTimer(), { answers: images.length });
            resetAttempt();
            enqueueSnackbar("That sequence didn't match — a new challenge has been issued", { variant: "error" });
        }
    }

    return (
        <Carousel
            activeIndex={slide}
            style={{
                height: "100%",
                width: "100%",
                borderRadius: "14px",
            }}>

            <EmailSlide
                email={email}
                setEmail={setEmail}
                callBack={startChallenge} />

            <React.Fragment key={"auth__login__carousel_item__challenges"}>
                {
                    (challenge?.image_sets ?? []).map((imageSet, index) => {
                        return (
                            <ChallengeSlide
                                key={`auth__login__challenge_${index}`}
                                index={index}
                                total={challenge?.image_sets.length ?? 0}
                                imageSet={imageSet}
                                selections={selections}
                                selection={selections[index]}
                                onSelect={(image) => selectImage(index, image)}
                                onNext={() => onNext(index)}
                                onReset={resetAttempt}
                                onLogin={index >= (MIN_ANSWERS - 1) ? () => onLogin(index) : undefined} />
                        )
                    })
                }
            </ React.Fragment>

        </Carousel>
    )
}

export default Login;
