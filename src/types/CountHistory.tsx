export interface Count{
    id:string,
    count:number
}

export interface CountHistory{
    stepValue:number,
    currentCount:number
    counts:Count[];
}