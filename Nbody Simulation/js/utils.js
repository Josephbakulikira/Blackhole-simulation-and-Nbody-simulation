import { GRAVITY, MIN_DISTANCE, RADIUS_FACTOR, TRAIL_LIMIT } from "./constants.js";

export class Body {
    constructor(x, y, vx, vy, mass, color, fx=0, fy=0){
        // position
        this.x = x;
        this.y = y;
        // velocity
        this.vx = vx;
        this.vy = vy;
        // force
        this.fx = fx;
        this.fy = fy;

        this.mass = mass;
        this.color = color;
        // this.radius = this.mass * RADIUS_FACTOR
        this.radius = RADIUS_FACTOR;
        this.trail = []
    }

    updateVelocity(others, dt){
        this.fx = 0;
        this.fy = 0;
        // G * m1 * m2 / R^2
        others.forEach(other => {
            if (other !== this){
                // // G * m1 * m2
                let numerator = GRAVITY * this.mass * other.mass;

                // Diff the two bodies
                let dx = (other.x - this.x);
                let dy = (other.y - this.y);
                // getting the distance ====> R
                let distance = Math.sqrt(dx*dx+ dy*dy);
                let effective_distance = Math.max(distance, MIN_DISTANCE);

                // // computing the force
                let force = numerator / (effective_distance * effective_distance);
                //normalize the diff vector
                this.fx += force * dx / effective_distance;
                this.fy += force * dy / effective_distance;
            }
        });

        let ax = this.fx/this.mass;
        let ay = this.fy/this.mass;

        this.vx += ax * dt;
        this.vy += ay * dt;

    }

    updatePositon(ctx, midX, midY, dt, position_scalar=1){
        this.x += (this.vx * dt);
        this.y += (this.vy * dt);

        this.trail.push([this.x, this.y]);

        if(this.trail.length > TRAIL_LIMIT){
            this.trail = this.trail.slice(1, this.length);
        }

        // this.fx = 0;
        // this.fy = 0;
        
        this.draw(ctx, midX, midY, position_scalar);
    }

    draw(ctx, midX, midY, position_scalar){
        // DRAW THE TRAIL
        ctx.beginPath();

        ctx.moveTo((this.trail[0][0] * position_scalar) + midX, (this.trail[0][1]* position_scalar) + midY);

        this.trail.forEach((point, index) => {
            if ( index != 0)
                ctx.lineTo(point[0] * position_scalar + midX, point[1] * position_scalar + midY);            
        });

        ctx.lineWidth =2;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = "";
        ctx.shadowColor=this.color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur= 10;
        ctx.stroke();
        
        // DRAW THE BODY/CIRCLE
        ctx.beginPath();
        ctx.arc((this.x * position_scalar) + midX, (this.y * position_scalar) + midY, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle=this.color;

    
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10;
        ctx.shadowColor=this.color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur= 100;
        ctx.fill();
        
    }
}