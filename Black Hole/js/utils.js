export function degree_to_radian(deg){
    return deg * (Math.PI/180);
}

export function Mapping(value, min1, max1, min2, max2){
    //(X-A)/(B-A) * (D-C) + C
    return (value - min1) / (max1 - min1) * (max2 - min2) + min2;
}