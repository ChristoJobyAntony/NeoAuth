export type Form = {
    value: string, 
    helperText: string, 
    error: boolean
}

export type _Object = {
    uid : string,
    name : string
}

export type Image = {
    uid : string
}

export type ImageSet = {
    uid : string,
    images : Image[]
}

export type Challenge = {
    imageSet? :ImageSet,
    selection? : Image,
}
