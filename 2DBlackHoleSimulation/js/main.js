import BlackHole from "./blackhole.js";
import { C, M, Rs, TIME_STEP } from "./constants.js";
import Photon from "./photon.js";

const canvas = document.querySelector("canvas");
var pause = false;

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const midX = canvas.width/2;
const midY = canvas.height/2;


const M87 = new BlackHole(midX, midY, 0, 0, Rs, M)
console.log(Rs, M)

let photons = []
let n_photons = 200;
let dist_between = 10;
let initial_speed = -C;

for(let i = 0; i < n_photons; i++){
    // photons.push(
    //     new Photon(canvas.width, midY - i * dist_between, initial_speed, 0)
    // );

    // left side 25%
    let ry1 = Math.random() * (canvas.height - 0) + 0;
    let rx1 = 0;
    // right side 25%
    let ry2 = Math.random() * (canvas.height - 0) + 0;
    let rx2 = canvas.width;
    // down side 25%
    let ry3 = canvas.height;
    let rx3 = Math.random() * (canvas.width - 0) + 0;
    // top side 25%
    let ry4 = 0;
    let rx4 = Math.random() * (canvas.width - 0) + 0;

    let coordinates = [
        [rx1, ry1],
        [rx2, ry2],
        [rx3, ry3],
        [rx4, ry4],
    ]

    let random_index = Math.round(Math.random() * (3 - 0) + 0);

    let tx = coordinates[random_index][0];
    let ty = coordinates[random_index][1];

    let tvx = (M87.x - tx) + Math.random() * (200, -200);
    let tvy = (M87.y - ty) + Math.random() * (200, -200);
    let magnitude = Math.sqrt(tvx**2 + tvy**2);
    tvx = (tvx / magnitude) * C;
    tvy = (tvy / magnitude) * C;



    photons.push(
       new Photon(tx, ty, tvx, tvy, 0)
    );

}




let animationId;
requestAnimationFrame(loop);
var lastTime;
var requiredElapsed = 1000 / 30; // desired interval is 10fps
// var delta_time = TIME_STEP/50
var delta_time = TIME_STEP/1000 // accurate simulation


ctx.fillStyle = 'rgba(40, 40, 40, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
// Main Loop
function loop(now) {
    if(!pause){
        requestAnimationFrame(loop);
        if (!lastTime) { lastTime = now; }
        var elapsed = now - lastTime;

        if (elapsed > requiredElapsed) {
            //clear the background
            ctx.fillStyle = 'rgba(40, 40, 40, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // do stuff
            
            M87.draw(ctx);

            
            photons.forEach(photon => {
                M87.pull(photon);
                photon.updatePosition(ctx, delta_time);

            });
            M87.draw(ctx);

        }
    }
}

loop()
