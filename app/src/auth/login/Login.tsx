import React, {useState} from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import {Carousel} from  "../../components/Carousel"
import ChallengeSlide from "./components/ChallengeSlide";
import EmailSlide from "./components/EmailSlide";
import {getImageSet} from "../api";
import { useAuth } from "../components/AuthProvider";
import { Form, ImageSet, Challenge } from "../types";

const MIN_CHALLENGES = 4;
const MAX_CHALLENGES = 8;
const initialChallengeSet : Challenge[] = [];
for (let i = 0; i < MIN_CHALLENGES; i++ ) {
    initialChallengeSet.push({
        imageSet : undefined,
        selection : undefined,
    });
}


function Login () {
    // const swiper = useSwiper();
    const navigate = useNavigate();
    const auth = useAuth();
    const {enqueueSnackbar} = useSnackbar();
    const [slide, setSlide] = useState<number>(0);
    const [challenges, setChallenges] = useState<Challenge[]>(initialChallengeSet.slice());
    const [email, setEmail] = useState<Form>({
        value : "", 
        helperText : "", 
        error: false
        });

    function updateChallenges(index:number, newChallenge : Partial<Challenge>) {
        const newChallenges = challenges.slice();
         newChallenges[index] = {...newChallenges[index], ...newChallenge}
        setChallenges(newChallenges);
    }
    
    async function loadImageSet(index : number) {
        const excludeSet : string[] = []
        for (let i =0; i < index; i ++) {
            let c = challenges[i]
            excludeSet.push(c.imageSet!.uid)
        }
        const imageSet : ImageSet = await getImageSet(email.value!, excludeSet)
        updateChallenges(index, {imageSet : imageSet})
    }

    async function onNextChallenge (current_challenge : number) {
        if (! challenges[current_challenge].selection) return enqueueSnackbar("Select an image", { variant: "error"})
        if (current_challenge + 1 >= MAX_CHALLENGES) return enqueueSnackbar("Maximum Challenges reached", {variant : "error"})
        if (current_challenge + 1 == challenges.length ){
            const newChallenges = challenges.slice();
            newChallenges.push({imageSet: undefined, selection: undefined});
            setChallenges(newChallenges);
        }
        console.log(challenges);
        if (! challenges[current_challenge+1]?.imageSet ) loadImageSet(current_challenge+1)
        setSlide(current_challenge+2);
    }

    async function resetAttempt() {
        const initialChallengeSet : Challenge[] = [];
        for (let i = 0; i < MIN_CHALLENGES; i++ ) {
        initialChallengeSet.push({
            imageSet : undefined,
            selection : undefined,
        });}
        setSlide(0);
        setChallenges(initialChallengeSet);        
    }

    async function  onLogin () {
        const images = challenges
        .filter((challenge) => challenge.selection?.uid)
        .map((challenge) => challenge.selection?.uid!);

        try {
            await auth.signIn(email.value, images);
            enqueueSnackbar("Logged in successfully", {variant : "success"});
            navigate("/dash");
        }catch (e){
            resetAttempt();
            enqueueSnackbar(String(e), {variant: "error"});
            setSlide(0);
        }
    }

    return (
            <Carousel 
            activeIndex={slide}
            style={{
                height: "100%",
                width: "100%",
                borderRadius : "10px",
            }}>
                
                <EmailSlide 
                    email={email} 
                    setEmail={setEmail}
                    callBack={()=>{
                        setSlide(1);
                        loadImageSet(0);
                    }}/>


                
                <React.Fragment key={"auth__login__carousel_item__challenges"}>
                {
                    challenges.map((challenge, index) =>{return(
                        <ChallengeSlide 
                            index={index}
                            challenge={challenge}
                            updateChallenge={(challenge) => updateChallenges(index, challenge)}
                            onNext={() => onNextChallenge(index)}
                            onReset={resetAttempt}
                            onLogin={index < (MIN_CHALLENGES-1) ? undefined : onLogin}/>
                    )})
                }
                </ React.Fragment>

            </Carousel>
    )
}


export default Login;

