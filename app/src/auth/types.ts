export type Form = {
    value: string,
    helperText: string,
    error: boolean
}

export type _Object = {
    uid: string,
    name: string
}

export type Image = {
    uid: string
}

export type ImageSet = {
    uid: string,
    images: Image[]
}

// A single-use challenge issued by the server: one image-set per position,
// the user identifies one secret object per set, in NeoPass order.
export type ServerChallenge = {
    uid: string,
    image_sets: ImageSet[]
}
