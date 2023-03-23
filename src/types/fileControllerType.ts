export type TCreateDir={
    name:string,
    type:string,
    parent:string
}

export type TGetFiles={
    parent:string
}

export type TUploadFile = {
    parent:string
}

export type TDowloadFile = {
    id:string
}

export type TDeleteFile = {
    id:string
}