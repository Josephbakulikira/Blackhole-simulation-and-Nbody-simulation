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
        this.radius = 1;
        this.trail = []
    }

    updateVelocity(others, dt, GRAVITY, MIN_DISTANCE){
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

    updatePositon(ctx, midX, midY, dt, TRAIL_LIMIT, RADIUS_FACTOR, position_scalar=1){
        this.x += (this.vx * dt);
        this.y += (this.vy * dt);

        this.trail.push([this.x, this.y]);

        if(this.trail.length > TRAIL_LIMIT){
            this.trail = this.trail.slice(this.trail.length - TRAIL_LIMIT, this.length);
        }

        // this.fx = 0;
        // this.fy = 0;
        
        this.draw(ctx, midX, midY, RADIUS_FACTOR, position_scalar);
    }

    draw(ctx, midX, midY, RADIUS_FACTOR, position_scalar){
        // DRAW THE TRAIL
        ctx.beginPath();
        ctx.moveTo((this.trail[0][0] *  position_scalar) + midX, (this.trail[0][1] * position_scalar) + midY);

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
        ctx.arc((this.x * position_scalar) + midX, (this.y * position_scalar) + midY, this.radius * RADIUS_FACTOR, 0, Math.PI * 2, false);
        ctx.fillStyle=this.color;

    
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10;
        ctx.shadowColor=this.color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur= 100;
        ctx.fill();
        ctx.shadowBlur= 0; 
    }
}

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }