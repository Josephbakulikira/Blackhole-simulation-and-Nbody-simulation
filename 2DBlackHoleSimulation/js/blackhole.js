import { C, G, SCALAR } from "./constants.js";

export default class BlackHole {
    constructor(x, y, vx, vy, rs, mass){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rs = rs;
        this.mass = mass;
        this.color = "#000000";
        this.diskColor = "#fff";
    }

    pull(photon){
        let fx = this.x - photon.x;
        let fy = this.y - photon.y;
        let distance = Math.sqrt(fx * fx + fy * fy);
        const fg = G * this.mass / (distance * distance);
        let mag = Math.sqrt(fx * fx + fy * fy);
        fx = (fx/mag) * fg;
        fy = (fy/mag) * fg;
        photon.vx += (fx);
        photon.vy += (fy);
        mag = Math.sqrt(photon.vx * photon.vx + photon.vy * photon.vy);
        photon.vx = (photon.vx/mag) * C;
        photon.vy = (photon.vy/mag) * C;
        // if(distance < this.rs){
        //     photon.trapped = true;
        // }
    }

    draw(ctx){

        // --- EVENT HORIZON ---
        ctx.beginPath();
        // console.log(this.x, this.y)
        ctx.arc(this.x , this.y, this.rs * SCALAR, 0, Math.PI * 2, true);
        ctx.fillStyle=this.color;
        ctx.shadowColor = "#e9d8a6";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;


        // --- PHOTON ORBIT ZONE ----
        ctx.beginPath();
        // ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
        ctx.arc(this.x , this.y, 1.5 * this.rs * SCALAR, 0, Math.PI * 2, true);
        ctx.shadowBlur = 5;
        ctx.strokeStyle= "orange";
        ctx.shadowBlur = 0;

        ctx.stroke()


        // --- ACCRETION DISK ---
        ctx.beginPath();
        // ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
        ctx.arc(this.x , this.y, 3 * this.rs * SCALAR, 0, Math.PI * 2, true);
        ctx.strokeStyle= this.diskColor;
        ctx.shadowColor=this.color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur= 0;
        ctx.stroke()
        // ctx.fill();
        

    }
}