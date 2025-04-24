import { INITIAL_N_BODY, TIME_STEP } from "./constants.js";
import { Body } from "./utils.js";

const canvas = document.querySelector("canvas");
var pause = false;

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const midX = canvas.width/2;
const midY = canvas.height/2;


// dom elements
let xPosInput = document.querySelector("#x-pos");
let yPosInput = document.querySelector("#y-pos");
let xVelInput = document.querySelector("#x-vel");
let yVelInput = document.querySelector("#y-vel");
let forceInput = document.querySelector("#force");
let colorInput = document.querySelector("#color");
let addBodyButton = document.querySelector("#addbutton");
let popupContainer = document.querySelector("#popupcontainer");
let scalarSlider = document.querySelector("#slider-scalar");

var POSITION_SCALAR = Number(scalarSlider.value);

// Initialize bodies array
let bodies = []

// populate the array with bodies (at random position)
for(let i = 0; i < INITIAL_N_BODY; i++){
    // random position
    let max = 1;
    let min = -1;
    let x = Math.random() * (max-min) + min;
    let y = Math.random() * (max-min) + min;

    // random velocity
    max = 1;
    min = -1;
    let vel_x = Math.random() * (max-min) + min;
    let vel_y = Math.random() * (max-min) + min;
    // append the list(array)
    let new_body = new Body(x, y, vel_x, vel_y, 10, "orange");
    bodies.push(new_body);
    
}

// let scalar = 300;

// let x = [];
// let y = [];
// let vx = [];
// let vy = [];

// x[1] = 0.5+0.2;
// y[1] = 0.5-0.2;
// x[2] = 0.5;
// y[2] = 0.5+0.2;
// x[0] = 0.97000436; 
// y[0] = -0.24308753;
// x[1] = -0.97000436; 
// y[1] = 0.24308753;

// x[2] = 0; 
// y[2] = 0;
// vx[0] = 0.93240737/2.0;
// vy[0] = 0.86473146/2.0;
// vx[1] = 0.93240737 / 2.0;
// vy[1] = 0.86473146 / 2.0;
// vx[2] = -0.93240737;
// vy[2] = -0.86473146;

// for(let i = 0; i < 3; i++){
//     let new_body = new Body(
//         x[i],
//         y[i],
//         vx[i],
//         vy[i],
//         1,
//         "#d83eff"
//     )
//     bodies.push(new_body);
// }

// console.log(bodies);

function AddBody(){
    let new_body = new Body(
        Number(xPosInput.getAttribute("value")),
        Number(yPosInput.getAttribute("value")),
        Number(xVelInput.getAttribute("value")),
        Number(yVelInput.getAttribute("value")),
        Number(forceInput.getAttribute("value")),
        String(colorInput.value)
    )

    // console.log(colorInput.value);
        // console.log()
    bodies.push(new_body);
    pause = false;
    popupContainer.classList = ['display_none'];


}



let animationId;
requestAnimationFrame(loop);
var lastTime;
var requiredElapsed = 1000 / 60; // desired interval is 10fps
// var delta_time = TIME_STEP/50
var delta_time = TIME_STEP/1000 // accurate simulation

ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
// Main Loop
function loop(now) {
    if(!pause){
        requestAnimationFrame(loop);
        if (!lastTime) { lastTime = now; }
        var elapsed = now - lastTime;

        if (elapsed > requiredElapsed) {
            // do stuff
            lastTime = now;
            // Clear the screen 
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Drawing and update
            bodies.forEach((body) => {
                body.updateVelocity(bodies, delta_time);
            });
            bodies.forEach((body) => {
                body.updatePositon(ctx, midX, midY, delta_time, POSITION_SCALAR);
            });
        }
    }
}


window.addEventListener("dblclick", (e) => {

    // alert("hello")
    // console.log(e);
    pause = true;
    popupContainer.classList = ['popup_container']


    // random position
    let x = (e.clientX - midX) / POSITION_SCALAR;
    let y = (e.clientY - midY)/ POSITION_SCALAR;
    
    // random velocity
    let max = 1;
    let min = -1;
    let vel_x = Math.random() * (max-min) + min;
    let vel_y = Math.random() * (max-min) + min;


    xPosInput.setAttribute("value", x);
    yPosInput.setAttribute("value", y);
    xVelInput.setAttribute("value", vel_x);
    yVelInput.setAttribute("value", vel_y);
    forceInput.setAttribute("value", 1);
});

addBodyButton.addEventListener("click", () => {
    AddBody();
    loop();
})

scalarSlider.oninput = function (e) {
	POSITION_SCALAR = this.value;
}


loop()
