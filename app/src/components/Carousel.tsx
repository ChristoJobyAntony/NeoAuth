import React, { useState } from "react";
import { Box, Typography} from "@mui/material";
import "./css/Carousel.css"


export const CarouselItem = (props : {children : JSX.Element, key? : string, width ?: string }) => {

    return(
        <div 
            className="carousel-item" 
            style={{width : (props.width ? props.width : "100%")}}>
                {props.children}
        </div>
    )
}

type CarouselProps = {
    children : JSX.Element[],
    activeIndex:number, 
    style?: React.CSSProperties,
}
export const Carousel = (props : CarouselProps ) => {
    // const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className="carousel" style={props.style}>
            <div className="inner"  style={{transform : `translateX(-${props.activeIndex * 100}%)`}} >
                {props.children.map((child, i) => {
                    return React.cloneElement(child, {width : "100%", key: `carousel_item_${i}`});
                })}
            </div>
        </div>
    )
}

export default Carousel
