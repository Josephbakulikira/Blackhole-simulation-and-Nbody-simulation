import { C, G, TRAIL_LIMIT } from "./constants.js";

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default class Photon{
    constructor(x, y, vx, vy, fx=0, fy=0){
        // position
        this.x = x;
        this.y = y;
        // velocity
        this.vx = vx;
        this.vy = vy;
        // force
        this.fx = fx;
        this.fy = fy;

        this.mass = 0;
        // this.color = getRandomColor();
        this.color = "orange"
        // this.radius = this.mass * RADIUS_FACTOR
        this.radius = 2;
        this.trail = [[x, y]]
        this.trapped = false;
    }

    updateVelocity(bh, dt){
        this.fx = 0;
        this.fy = 0;
        // G * m1 * m2 / R^2
        
        // // G * m1 * m2
        let numerator = G * bh.mass;
        // console.log(numerator)
        // Diff the two bodies
        let dx = (bh.x - this.x);
        let dy = (bh.y - this.y);
        // getting the distance ====> R
        let distance = Math.sqrt(dx*dx+ dy*dy);  
        // // computing the force
        let force = numerator / (distance * distance);
        //normalize the diff vector
        this.fx = force * dx / (distance);
        this.fy = force * dy / (distance);
        
        this.vx += this.fx * dt;
        this.vy += this.fy * dt;

        // normalize velocity
        let magg = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

        if(magg > C){
            this.vx = (this.vx / magg) * C;
            this.vy = (this.vy / magg) * C;
        }

        if(distance < bh.rs){
            // console.log(bh.rs)
            // this.trapped = true
        }
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

        // this.fx = 0;
        // this.fy = 0;
        
        this.draw(ctx);
    }

    draw(ctx){
        // DRAW THE TRAIL
        // ctx.beginPath();

        // ctx.moveTo((this.trail[0][0]), (this.trail[0][1]));

        // this.trail.forEach((point, index) => {
        //     if ( index != 0)
        //         ctx.lineTo(point[0], point[1]);            
        // });

        // ctx.lineWidth =2;
        // ctx.strokeStyle = this.color;
        // ctx.fillStyle = "";
        // ctx.shadowColor=this.color;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 0;
        // ctx.shadowBlur= 10;
        ctx.stroke();
        
        // DRAW THE BODY/CIRCLE
        ctx.beginPath();
        ctx.arc((this.x), (this.y), this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle=this.color;

    
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10;
        // ctx.shadowColor=this.color;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 0;
        // ctx.shadowBlur= 20;
        ctx.fill();
        
    }
}