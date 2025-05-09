import { C, colors, G, TRAIL_LIMIT } from "./constants.js";

function getRandomColor() {
    var rndI = Math.round(Math.random() * (colors.length - 0) + 0);
    return colors[rndI];
}

export default class Photon{
    constructor(x, y, vx, vy){
        // position
        this.x = x;
        this.y = y;
        // velocity
        this.vx = vx;
        this.vy = vy;

        this.mass = 0;
        this.color = getRandomColor();
        this.trailColor = "#ffaf88";
        // this.color = "purple"
        // this.radius = this.mass * RADIUS_FACTOR
        this.radius = 5;
        this.trail = [[x, y]]
        this.trapped = false;
    }

    updatePosition(ctx, dt){
        if(!this.trapped){
            this.x += (this.vx * dt);
            this.y += (this.vy * dt);

            this.trail.push([this.x, this.y]);

            if(this.trail.length > TRAIL_LIMIT){
                this.trail = this.trail.slice(1, this.length);
            }
        }

        this.draw(ctx);
    }

    draw(ctx){
        // DRAW THE TRAIL
        ctx.beginPath();

        ctx.moveTo((this.trail[0][0]), (this.trail[0][1]));

        this.trail.forEach((point, index) => {
            if ( index != 0)
                ctx.lineTo(point[0], point[1]);            
        });

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.trailColor;
        ctx.fillStyle = this.trailColor;
        ctx.shadowColor=this.color;
        ctx.shadowBlur = 0;
        ctx.stroke();
        // DRAW THE BODY/CIRCLE
        ctx.beginPath();
        ctx.arc((this.x), (this.y), this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle=this.color;
        ctx.shadowColor=this.color;
        ctx.shadowBlur= 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        
    }
}