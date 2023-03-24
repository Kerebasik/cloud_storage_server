export type TInputCreateDir={
    name:string,
    type:string,
    parent:string
}

export type TInputGetFiles={
    parent:string
    sort:string
}

export type TInputUploadFile = {
    parent:string
}

export type TInputDownloadFile = {
    id:string
}

export type TInputDeleteFile = {
    id:string
}

export type TInputSearchFile = {
    search: string
}