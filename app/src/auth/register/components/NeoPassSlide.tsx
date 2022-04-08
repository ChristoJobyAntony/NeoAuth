import { Button, Card, Step, StepLabel, Stepper, Tooltip, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { CarouselItem } from "../../../components/Carousel";
import api from "../../api";
import { _Object } from "../../types";

type props = {
    prompt?: string,
    objects : _Object[],
    onPrev: () => void,
    onNext : (objects : _Object[]) => void,
};

const MAX_OBJECTS = 8;
const MIN_OBJECTS = 4;
const defaultSelectedObjects = [undefined, undefined, undefined, undefined];

function NeoPassSlide ( {prompt, objects, onPrev, onNext} : props ) {
    const [selectedObjects, setSelectedObjects] = useState<(_Object|undefined)[]>(defaultSelectedObjects);
    const [objectCounter, setObjectCounter] = useState<number>(0);
    const {enqueueSnackbar} = useSnackbar();

    async function onSelectObject (obj : _Object) {
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

    function next () {
        const objects = [];
        for (const obj of selectedObjects) {
            if (obj) objects.push(obj);
        }
        onNext(objects);
        resetObjectSelection();
    }

    return (
    <CarouselItem width="100%">
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
                        {prompt}
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
                onClick={() => {
                    resetObjectSelection();
                    onPrev();
                }}>
                    Back
                </Button>
                <Button
                disabled={objectCounter == 0 }
                onClick={()=> resetObjectSelection()}>
                    Reset
                </Button>
                <Button
                disabled={objectCounter < MIN_OBJECTS}
                onClick={next}>
                    Next
                </Button>
            </div>
        </div>
    </CarouselItem>)
}

export default NeoPassSlide;
