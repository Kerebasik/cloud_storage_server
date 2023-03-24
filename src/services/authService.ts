import SHA256 from "crypto-js/sha256";

interface IPassValidFunc  {
    (password:string, userPasswordDB:string):boolean
}

export function PassValid<IPassValidFunc>(password:string, userPasswordDB:string):boolean{

    return String(SHA256(password))===userPasswordDB
}