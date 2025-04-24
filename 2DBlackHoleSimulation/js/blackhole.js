export default class BlackHole {
    constructor(x, y, vx, vy, rs, mass){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rs = rs;
        this.mass = mass;
        this.color = "#000000"
        this.diskColor = "#fff"
    }

    draw(ctx){

        // --- EVENT HORIZON ---
        ctx.beginPath();
        console.log(this.x, this.y)
        ctx.arc(this.x , this.y, this.rs, 0, Math.PI * 2, true);
        ctx.fillStyle=this.color;
        ctx.fill();

        // --- PHOTON ORBIT ZONE ----
        ctx.beginPath();
        // ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
        ctx.arc(this.x , this.y, 1.5 * this.rs, 0, Math.PI * 2, true);
        ctx.strokeStyle= "yellow";
        ctx.stroke()


        // --- ACCRETION DISK ---
        ctx.beginPath();
        // ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
        ctx.arc(this.x , this.y, 3 * this.rs, 0, Math.PI * 2, true);
        ctx.strokeStyle= this.diskColor;
        ctx.shadowColor=this.color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur= 0;
        ctx.stroke()
        // ctx.fill();
        

    }
}