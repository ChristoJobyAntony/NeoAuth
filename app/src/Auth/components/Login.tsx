import React, {useState, useRef, forwardRef, useEffect} from "react";
import { Box as div, Typography, Card, Button, TextField, Grid} from "@mui/material";
import { useSnackbar } from "notistack";

import {Carousel, CarouselItem} from  "../../components/Carousel"
import {checkEmailExists, getImageUrl, getImageSet, loginUser, authUser} from "../api";



const MIN_CHALLENGES = 4;
const MAX_CHALLENGES = 8;
const DIMENSION = 4;
const NUMBERS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
const initialChallengeSet : Challenge[] = [];
for (let i = 0; i < MIN_CHALLENGES; i++ ) {
    initialChallengeSet.push({
        imageSet : undefined,
        selection : undefined,
    });
}


type emailForm = {
    value: string, 
    helperText: string, 
    error: boolean
}

type Image = {
    uid : string
}

type ImageSet = {
    uid : string,
    images : Image[]
}

type Challenge = {
    imageSet? :ImageSet,
    selection? : string,
}


const Login = () => {
    // const swiper = useSwiper();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [email, setEmail] = useState<emailForm>(
        {
            value : "", 
            helperText : "", 
            error: false
        }
    )
    

    const [challenges, setChallenges] = useState<Challenge[]>(initialChallengeSet.slice())


    async function updateEmail ( update : Partial<emailForm>) {
        const newForm = {...email, ...update}
        setEmail(newForm);
    }

    async function updateChallenges(index:number, newChallenge : Partial<Challenge>) {
        const newChallenges = challenges.slice();
         newChallenges[index] = {...newChallenges[index], ...newChallenge}
        setChallenges(newChallenges);
    }

    async function onEnterEmail() {
        if ( ! email.value ) return updateEmail({helperText: "Please enter a value", error: true})
        if ( ! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value) ) return updateEmail({helperText : "Please enter a valid email", error: true})
        if(await checkEmailExists(email.value)) {
            setActiveIndex(1)
            loadImageSet(0)
            return 
        }
        else { updateEmail({helperText: "Email address not found !", error: true}) }
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
        setActiveIndex(current_challenge+2);
    }

    async function resetAttempt() {
        const initialChallengeSet : Challenge[] = [];
        for (let i = 0; i < MIN_CHALLENGES; i++ ) {
        initialChallengeSet.push({
            imageSet : undefined,
            selection : undefined,
        });}
        setActiveIndex(0);
        setChallenges(initialChallengeSet);        
    }

    async function  onLogin () {
        const images = challenges.filter((challenge) => challenge.selection).map((challenge) => challenge.selection!);
        if ( await authUser(email.value, images) )  enqueueSnackbar("Login Successful !", {variant : "success"})
        else enqueueSnackbar("Sorry the login attempt has failed ", { variant : "error"})
        
    }



    return (
            <Carousel 
            activeIndex={activeIndex}
            style={{
                height: "100%",
                width: "100%",
                borderRadius : "10px",
            }}>
                
                <CarouselItem key={`auth__login__carousel_item_email`} >
                    <div 
                        style={{
                            display:"flex",
                            flexDirection:"column",
                            width:"100%",
                            height:"100%",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                    }}>
                        <div
                            style={{
                                flex : "0 0",
                                display: "flex",
                                alignItems: "center",
                                padding: "20px"
                        }}>
                            <Typography variant="h5" flexGrow={1} textAlign="center" >
                                Hey there 👋 <br/> Welcome Back 🙌
                            </Typography>
                        </div>
                    
                        <div 
                            style={{
                                flex: "2 0",
                                width: "70%",
                                display:  "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                        }}>
                            <Typography variant="subtitle1">
                                Enter your email address 📧
                            </Typography>
                            <br/>
                            <TextField 
                                required
                                id="auth__login__text_field_email" 
                                label="Email Address" 
                                variant="outlined"
                                helperText={email.helperText}
                                style={{width:"100%"}}
                                value={email.value}
                                error={email.error}
                                onChange={(e)=>{updateEmail({value:e.target.value})}
                            }
                            />
                        </div> 
                        

                        <div
                            style={{
                                flex:"1 0"
                            }}
                        >
                            <Button
                            variant="outlined"
                            sx={{flexShrink: 0}}
                            onClick={(_) => {onEnterEmail()}}
                            > 
                                Next 
                            </Button>

                        </div>

                    </div>
                </CarouselItem >


                
                <React.Fragment key={"auth__login__carousel_item__challenges"}>
                {
                    challenges.map((challenge, index) =>{return(
                        <CarouselItem 
                            key={`auth__login__carousel_item__challenge_${index}`} 
                            style={{width : "100%"}}>
                            <div 
                                style={{ 
                                    display: "flex", 
                                    flexDirection: "column", 
                                    height:"100%", 
                                    width: "100%", 
                                    alignItems:"center", 
                                    justifyContent: "space-evenly"}}
                                    >
                                <Typography variant="h6" padding="10px">
                                    Select the image with your {NUMBERS[index]} secret object 🔎
                                </Typography>

                                <div 
                                    style={{ 
                                        display: "grid", 
                                        gridTemplateColumns: `repeat(${DIMENSION}, auto)`, 
                                        columnGap: "7px", 
                                        rowGap:"5px", 
                                        maxWidth:"50vh", 
                                        flex: "0 0" }}>
                                    
                                    {challenge.imageSet?.images.map((image, j) => {
                                        return(
                                            <Button 
                                                variant="outlined"
                                                key={`auth__login__carousel_item_button_${index}_${j}`}
                                                style={{
                                                    width:"100%",
                                                    height: "auto",
                                                    aspectRatio: "1",
                                                    border:"2px solid black",
                                                    padding:"0px",
                                                    borderColor: (image.uid == challenge.selection) ? "red" : "black"
                                                }}
                                                onClick={(e)=>{
                                                    updateChallenges(index, {selection: image.uid})
                                                }}
                                                >
                                                <img
                                                    key={`auth__login__carousel_${index}_item_image_${j}`}
                                                    style={{
                                                        width:"100%",
                                                        height: undefined,
                                                        aspectRatio: "1",
                                                        objectFit: "contain"
                                                    }} 
                                                    src={getImageUrl(image.uid)}
                                                    loading="lazy"
                                                    alt={`challenge_${index}_${j}`}/>
                                            </Button>
                                        )
                                    })}
                                </div>
                                <div 
                                    style={{
                                        flex:"1 0",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "90%",
                                        }}>
                                    <Button
                                        variant="outlined"
                                        key={`auth__login__carousel_${index}_back_button`}
                                        size="medium"
                                        onClick={()=> resetAttempt()}>
                                        Reset
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        disabled={index + 1 >= MIN_CHALLENGES ? false : true}
                                        size="medium"
                                        key={`auth__login__carousel_${index}_login_button`}
                                        onClick={index + 1 >= MIN_CHALLENGES ? () => onLogin() : undefined}>
                                        Login 🔑
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        key={`auth__login__carousel_${index}_next_button`}
                                        disabled={index + 1 == MAX_CHALLENGES ? true : false}
                                        size="medium"
                                        onClick={(_) => onNextChallenge(index)}>
                                        Next
                                    </Button>
                                    
                                </div>
                            </div>
                        </CarouselItem>
                    )})
                }
                </ React.Fragment>

            </Carousel>
    )
}


export default Login;