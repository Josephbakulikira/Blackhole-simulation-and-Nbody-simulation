import Stats from "./stats.module.js";
import { Body, hexToRgb } from "./utils.js";

const canvas = document.querySelector("canvas");
var pause = false;

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const midX = canvas.width / 2;
const midY = canvas.height / 2;

// dom elements
// ----------------------------------------
// ----- TOGGLE MENU -------
// ----------------------------------------

let menuButton = document.querySelector("#menu-button");
let menuButtonContainer = document.querySelector(".menu-button");
let closeButton = document.querySelector("#close-button");

let parameterPanel = document.querySelector("#parameter-panel");
parameterPanel.style.display = "none";

// ----------------------------------------
// -------- POPUP PARAMATERS --------------
// ----------------------------------------

let xPosInput = document.querySelector("#x-pos");
let yPosInput = document.querySelector("#y-pos");
let xVelInput = document.querySelector("#x-vel");
let yVelInput = document.querySelector("#y-vel");
let forceInput = document.querySelector("#force");
let colorInput = document.querySelector("#color");
let addBodyButton = document.querySelector("#addbutton");
let popupContainer = document.querySelector("#popupcontainer");

// ----------------------------------------
// declaring dom variables
// -----------------------------------------
let scalarSlider = document.querySelector("#slider-scalar");
let scalarOutput = document.querySelector("#scalar-output");
let backgroundInput = document.querySelector("#color-input");

let timestepInput = document.querySelector("#timestep-input");
let timestepOutput = document.querySelector("#timestep-output");

let mindistInput = document.querySelector("#min-distance-input");
let mindistOutput = document.querySelector("#mindistance-output");

let gravityInput = document.querySelector("#gravity-input");
let gravityOutput = document.querySelector("#gravity-output");

let radiusInput = document.querySelector("#radius-input");
let radiusOutput = document.querySelector("#radius-outpu");

let tailLimitInput = document.querySelector("#trail-input");
let trailOutput = document.querySelector("#trail-output");

let simulationSelect = document.querySelector("#simulation");

let playPauseButton = document.querySelector("#playpause");
let restartButton = document.querySelector("#restart");

// ----- DEFINE OUR VARIABLES
var POSITION_SCALAR = Number(scalarSlider.value);
var RADIUS_FACTOR = Number(radiusInput.value);
var GRAVITY = Number(gravityInput.value);
var TIME_STEP = Number(timestepInput.value);
var MIN_DISTANCE = Number(mindistInput.value);
var TRAIL_LIMIT = Number(tailLimitInput.value); // tail
var BACKGROUND_COLOR = {
  r: 0,
  g: 0,
  b: 0,
};


// Initialize bodies array
let bodies = [];

let colorpalette1 = [
    "#03045e",
    "#023e8a",
    "#0077b6",
    "#0096c7",
    "#00b4d8",
    "#48cae4",
    "#90e0ef",
    "#ade8f4",
    "#caf0f8",
];
let colorpalette2 = [
    "#e9d8a6",
    "#ee9b00",
    "#ca6702",
    "#bb3e03",
    "#ae2012",
    "#9b2226",
    "#ffbe0b",
    "#fb5607",
]

// **********************
// **SIMULATIONS SETUPS**
// **********************

var predefinedSetups = {
  body2: () => {
    bodies = []
    // populate the array with bodies (at random position)
    for (let i = 0; i < 2; i++) {
      // random position
      let max = 1;
      let min = -1;
      let x = Math.random() * (max - min) + min;
      let y = Math.random() * (max - min) + min;

      // random velocity
      max = 1;
      min = -1;
      let vel_x = Math.random() * (max - min) + min;
      let vel_y = Math.random() * (max - min) + min;
      // append the list(array)
      let new_body = new Body(x, y, vel_x, vel_y, 10, "orange");
      bodies.push(new_body);
    }
    MIN_DISTANCE = 1;
    mindistInput.value = 1;
    mindistOutput.innerHTML = 1;

    GRAVITY = 6;
    gravityInput.value = 6;
    gravityOutput.innerHTML = 6;

    POSITION_SCALAR = 300;
    scalarOutput.innerHTML = 300;
    scalarSlider.value = 300;
  },
  figure8: () => {
    bodies = []
    let x = [];
    let y = [];
    let vx = [];
    let vy = [];
    
    x[1] = 0.5 + 0.2;
    y[1] = 0.5 - 0.2;
    x[2] = 0.5;
    y[2] = 0.5 + 0.2;
    x[0] = 0.97000436;
    y[0] = -0.24308753;
    x[1] = -0.97000436;
    y[1] = 0.24308753;
    
    x[2] = 0;
    y[2] = 0;
    vx[0] = 0.93240737 / 2.0;
    vy[0] = 0.86473146 / 2.0;
    vx[1] = 0.93240737 / 2.0;
    vy[1] = 0.86473146 / 2.0;
    vx[2] = -0.93240737;
    vy[2] = -0.86473146;
    
    for (let i = 0; i < 3; i++) {
      let new_body = new Body(x[i], y[i], vx[i], vy[i], 1, "#ee8d0e");
      bodies.push(new_body);
    }
      MIN_DISTANCE = 0.001;
      mindistInput.value = 0.001;
      mindistOutput.innerHTML = 0.001;
  
      GRAVITY = 1;
      gravityInput.value = 1;
      gravityOutput.innerHTML = 1;
  
      POSITION_SCALAR = 300;
      scalarOutput.innerHTML = 300;
      scalarSlider.value = 300;

      TIME_STEP = 10;
      timestepInput.value = 10;
      timestepOutput.innerHTML = 10
  },
  figure8randomcolor: () => {
    bodies = []
    let x = [];
    let y = [];
    let vx = [];
    let vy = [];
    
    x[1] = 0.5 + 0.2;
    y[1] = 0.5 - 0.2;
    x[2] = 0.5;
    y[2] = 0.5 + 0.2;
    x[0] = 0.97000436;
    y[0] = -0.24308753;
    x[1] = -0.97000436;
    y[1] = 0.24308753;
    
    x[2] = 0;
    y[2] = 0;
    vx[0] = 0.93240737 / 2.0;
    vy[0] = 0.86473146 / 2.0;
    vx[1] = 0.93240737 / 2.0;
    vy[1] = 0.86473146 / 2.0;
    vx[2] = -0.93240737;
    vy[2] = -0.86473146;
    
    for (let i = 0; i < 3; i++) {
      let rc_index = Math.round(Math.random() * ((colorpalette2.length-1) - 0) + 0);

      let new_body = new Body(x[i], y[i], vx[i], vy[i], 1, colorpalette2[rc_index]);
      bodies.push(new_body);
    }
      MIN_DISTANCE = 0.001;
      mindistInput.value = 0.001;
      mindistOutput.innerHTML = 0.001;
  
      GRAVITY = 1;
      gravityInput.value = 1;
      gravityOutput.innerHTML = 1;
  
      POSITION_SCALAR = 300;
      scalarOutput.innerHTML = 300;
      scalarSlider.value = 300;

      TIME_STEP = 10;
      timestepInput.value = 10;
      timestepOutput.innerHTML = 10
  },
  chaos: () => {
    bodies = []
    // populate the array with bodies (at random position)
    for (let i = 0; i < 100; i++) {
      // random position
      let max = 1;
      let min = -1;
      let x = Math.random() * (max - min) + min;
      let y = Math.random() * (max - min) + min;

      // random velocity
      max = 1;
      min = -1;
      let vel_x = Math.random() * (max - min) + min;
      let vel_y = Math.random() * (max - min) + min;
      // append the list(array)
      let new_body = new Body(x, y, vel_x, vel_y, 10, "orange");
      bodies.push(new_body);
    }
    MIN_DISTANCE = 0.1;
    mindistInput.value = 0.1;
    mindistOutput.innerHTML = 0.1;

    GRAVITY = 4;
    gravityInput.value = 4;
    gravityOutput.innerHTML = 4;

    TIME_STEP = 1;
    timestepInput.value = 1;
    timestepOutput.innerHTML = 1;

    POSITION_SCALAR = 250;
    scalarOutput.innerHTML = 250;
    scalarSlider.value = 250;

    TRAIL_LIMIT = 10;
    tailLimitInput.value = 10;
    trailOutput.value = 10;
  },
  chaosrandomcolor: () => {
    bodies = []
    // populate the array with bodies (at random position)
    for (let i = 0; i < 100; i++) {
      // random position
      let max = 1;
      let min = -1;
      let x = Math.random() * (max - min) + min;
      let y = Math.random() * (max - min) + min;

      // random velocity
      max = 1;
      min = -1;
      let vel_x = Math.random() * (max - min) + min;
      let vel_y = Math.random() * (max - min) + min;
      // random color index
      let rc_index = Math.round(Math.random() * ((colorpalette1.length - 1) - 0) + 0);
      // append the list(array)
    //   console.log(colorpalette1[rc_index], )
      let new_body = new Body(x, y, vel_x, vel_y, 10, colorpalette1[rc_index]);
      bodies.push(new_body);
    }
    MIN_DISTANCE = 0.1;
    mindistInput.value = 0.1;
    mindistOutput.innerHTML = 0.1;

    GRAVITY = 2;
    gravityInput.value = 2;
    gravityOutput.innerHTML = 2;

    TIME_STEP = 0.6;
    timestepInput.value = 0.6;
    timestepOutput.innerHTML = 0.6;

    POSITION_SCALAR = 250;
    scalarOutput.innerHTML = 250;
    scalarSlider.value = 250;

    TRAIL_LIMIT = 2;
    tailLimitInput.value = 2;
    trailOutput.value = 2;
  },
};

Object.keys(predefinedSetups).map((elem) => {
    const option_node = document.createElement("option");
    option_node.value = elem;
    option_node.innerHTML = elem;
    simulationSelect.appendChild(option_node)
})

var SIMULATIONSELECTION = "chaosrandomcolor";
predefinedSetups[SIMULATIONSELECTION]();

function AddBody() {
  let new_body = new Body(
    Number(xPosInput.getAttribute("value")),
    Number(yPosInput.getAttribute("value")),
    Number(xVelInput.getAttribute("value")),
    Number(yVelInput.getAttribute("value")),
    Number(forceInput.getAttribute("value")),
    String(colorInput.value)
  );
  bodies.push(new_body);
  pause = false;
  popupContainer.classList = ["display_none"]; // or just style.display = "none"
}

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

let animationId;
var lastTime;
var requiredElapsed = 1000 / 60; // desired interval is 10fps

ctx.fillStyle = `rgba(${BACKGROUND_COLOR.r}, ${BACKGROUND_COLOR.g}, ${BACKGROUND_COLOR.b}, 1)`;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Main Loop
function loop(now) {

  // accurate simulation
  var delta_time = TIME_STEP / 1000;
  if (!pause) {

    requestAnimationFrame(loop);

    if (!lastTime) {
      lastTime = now;
    }
    var elapsed = now - lastTime;

    if (elapsed > requiredElapsed) {
      stats.begin();

      // do stuff
      lastTime = now;
      // Clear the screen
      ctx.fillStyle = `rgba(${BACKGROUND_COLOR.r}, ${BACKGROUND_COLOR.g}, ${BACKGROUND_COLOR.b}, 0.2)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Drawing and update
      bodies.forEach((body) => {
        body.updateVelocity(bodies, delta_time, GRAVITY, MIN_DISTANCE);
      });
      bodies.forEach((body) => {
        body.updatePositon(
          ctx,
          midX,
          midY,
          delta_time,
          TRAIL_LIMIT,
          RADIUS_FACTOR,
          POSITION_SCALAR
        );
      });
      stats.end();
    }
  }
}


// ----------------------
// ------ EVENTS --------
// ----------------------

function HandleEvents() {
  // *******************************************
  // *** ADDING THE BODY EVENTS ****************
  // *******************************************

  canvas.addEventListener("dblclick", (e) => {
    // alert("hello")
    // console.log(e);
    pause = true;
    popupContainer.classList = ["popup_container"];

    // random position
    let x = (e.clientX - midX) / POSITION_SCALAR;
    let y = (e.clientY - midY) / POSITION_SCALAR;

    // random velocity
    let max = 1;
    let min = -1;
    let vel_x = Math.random() * (max - min) + min;
    let vel_y = Math.random() * (max - min) + min;

    xPosInput.setAttribute("value", x);
    yPosInput.setAttribute("value", y);
    xVelInput.setAttribute("value", vel_x);
    yVelInput.setAttribute("value", vel_y);
    forceInput.setAttribute("value", 1);
  });

  addBodyButton.addEventListener("click", () => {
    AddBody();
    loop();
  });

  // *******************************************
  // ***** TOGGLE PARAMETER PANEL EVENTS *******
  // *******************************************

  menuButton.addEventListener("click", (e) => {
    parameterPanel.style.display = "block";
    menuButtonContainer.style.display = "none";
  });
  closeButton.addEventListener("click", (e) => {
    parameterPanel.style.display = "none";
    menuButtonContainer.style.display = "flex";
  });

  // ******************************************
  // ********* VARIABLE UPDATE ****************
  // ******************************************
  backgroundInput.oninput = function (e) {
    BACKGROUND_COLOR = hexToRgb(this.value);
  };
  scalarSlider.oninput = function (e) {
    POSITION_SCALAR = this.value;
    // update the output
    scalarOutput.innerHTML = this.value;
  };
  timestepInput.oninput = function (e) {
    TIME_STEP = this.value;
    // update the output
    timestepOutput.innerHTML = this.value;
  };
  mindistInput.oninput = function (e) {
    MIN_DISTANCE = this.value;
    // update the output
    mindistOutput.innerHTML = this.value;
  };
  gravityInput.oninput = function (e) {
    GRAVITY = this.value;
    // update the output
    gravityOutput.innerHTML = this.value;
  };
  radiusInput.oninput = function (e) {
    RADIUS_FACTOR = this.value;
    // update the output
    radiusOutput.innerHTML = this.value;
  };
  tailLimitInput.oninput = function (e) {
    TRAIL_LIMIT = this.value;
    // update the output
    trailOutput.innerHTML = this.value;
  };
  simulationSelect.oninput = function (e) {
    SIMULATIONSELECTION = this.value;
    restartSimulation();
  };

  // **********************************
  // ****** PAUSE-PLAY-RESTART---------
  // **********************************
  restartButton.onclick = function(e) {
    restartSimulation();

  }
  playPauseButton.onclick = function(e){
    pause = !pause;
    // console.log(pause);
    playPauseButton.innerHTML = pause === false ? "pause" : "play";
    if(pause === false){
        loop()
    }
  }
}

function restartSimulation(){
    ctx.fillStyle = `rgba(${BACKGROUND_COLOR.r}, ${BACKGROUND_COLOR.g}, ${BACKGROUND_COLOR.b}, 1)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    predefinedSetups[SIMULATIONSELECTION]();
    loop();
}

// ----- MAIN LOOP ------
HandleEvents();
loop();
