// dots is an array of Dot objects,
// mouse is an object used to track the X and Y position
// of the mouse, set with a mousemove event listener below
var dots = [],
mouse = {
    x: 0,
    y: 0
};

// The Dot object used to scaffold the dots
var Dot = function() {
 this.x = 0;
 this.y = 0;
 this.node = (function(){
   var n = document.createElement("div");
   n.className = "trail";
   document.body.appendChild(n);
   return n;
 }());
};
// The Dot.prototype.draw() method sets the position of 
 // the object's <div> node
Dot.prototype.draw = function() {
 this.node.style.left = this.x + "px";
 this.node.style.top = this.y + "px";
};

// Creates the Dot objects, populates the dots array
for (var i = 0; i < 3; i++) {
 var d = new Dot();
 dots.push(d);
}

// This is the screen redraw function
function draw() {
 // Make sure the mouse position is set everytime
   // draw() is called.
 var x = mouse.x,
     y = mouse.y;

 // This loop is where all the 90s magic happens
 dots.forEach(function(dot, index, dots) {
    var nextDot = dots[index+1] || dots[0];
    dot.x = x;
    dot.y = y;
    dot.draw();
    if (Math.random() > 0.5) {
        x += Math.random() * 25;
    } else {
        x -= Math.random() * 25;
    }
    
    if (Math.random() > 0.5) {
        y += Math.random() * 25;
    } else {
        y -= Math.random() * 25;
    }

    x += (nextDot.x - dot.x) * 0.6
    y += (nextDot.y - dot.y) * 0.6
 });
}

addEventListener("mousemove", function(event) {
 //event.preventDefault();
 mouse.x = event.pageX + 7;
 mouse.y = event.pageY + 7;
});

// animate() calls draw() then recursively calls itself
// everytime the screen repaints via requestAnimationFrame().
function animate() {
    draw();
    setTimeout(() => {requestAnimationFrame(animate)}, 1000 / 25);
}

// And get it started by calling animate().
animate();

const boy = document.querySelector('.boy');
const girl = document.querySelector('.girl');
const started = new Date("2025-02-16T00:00:00");
const targetDate = new Date("2025-05-01T00:00:00");
const startPosition = boy.x;
const diff = girl.x - boy.x;

document.addEventListener('DOMContentLoaded', function () {
    function movePoint() {
        let now = new Date();
        let position = startPosition + diff * ((now.getTime() - started.getTime()) / (targetDate.getTime() - started.getTime()));
        if (now.getTime() <= targetDate.getTime()) {
            boy.style.left = position + 'px';
        } else {
            boy.style.left = girl.x + 'px';
        }

        // Check if the point has moved out of the screen
        if (position <= girl.x) {
            requestAnimationFrame(movePoint);
        }
    }

    // Start moving the point
    movePoint();
});

const seconds = document.getElementById("seconds");
let currentSeconds = 0;
const minutes = document.getElementById("minutes");
let currentMinutes = 0;
const hours = document.getElementById("hours");
let currentHours = 0;
const days = document.getElementById("days");
let currentDays = 0;

function makeElement(type, id, ...classes) {
  //----------------------------------------------------//
  //Returns an HTML element                             //
  //----------------------------------------------------//
  //type(string): type of HTML element to create        //
  //id(string): id of the element                       //
  //classes(string): classes to add to the element      //
  //----------------------------------------------------//
  //return(element): HTML element                       //
  //----------------------------------------------------//

  let element = document.createElement(type);
  if (typeof id === "string") {element.id = id}
  classes.forEach(x => element.classList.add(x));
  return element;
}

function changeTime(old, time, target, unit) {
  //----------------------------------------------------//
  //Changes the displayed time                          //
  //----------------------------------------------------//
  //old(string): the previous unit of time that is      //
  //  to be changed                                     //
  //time(integer): the new unit of time to display      //
  //target(HTML element): where to display the updated  //
  //  time                                              //
  //unit(string): the unit of time, used so the previous//
  //  element can be found and removed                  //
  //----------------------------------------------------//
  //return(string): the currently displayed time        //
  //----------------------------------------------------//

  //
  //Converts the time integer into a string and pads it
  //  with 0s if neccessary
  time = time.toString(10).padStart(2, 0);

  //
  //Gets the elements that are displaying the current time
  let oldTop = document.getElementById(`${old}T${unit}`);
  let oldBottom = document.getElementById(`${old}B${unit}`);

  //
  //If the old elements aren't null (they exist) then they
  //  are removed after a timeout
  if (oldTop) {
    oldTop.style.transform = "rotateX(-180deg)";

    setTimeout(function() {
      oldTop.parentNode.removeChild(oldTop);
    }, 200);
    setTimeout(function() {
      oldBottom.parentNode.removeChild(oldBottom);
    }, 400);
  }

  //
  //Creates a new element to display the updated time, pre-rotated
  //  so it can be flipped into place
  let spanBottom = makeElement("span", `${time}B${unit}`, "bottom");
  spanBottom.style.transform = "rotateX(180deg)";
  spanBottom.innerHTML = time;
  //
  //Inserts the element "under" the topmost element
  target.insertBefore(spanBottom, target.childNodes[0]);
  setTimeout(function() {
    spanBottom.style.transform = "rotateX(0deg)";
  }, 10);
  //
  //Places the flipped time above the old time so it's visible
  setTimeout(function() {
    spanBottom.style.zIndex = "2";
    if (oldBottom) {oldBottom.style.zIndex = "-1";}
    //oldBottom.style.zIndex = "-1";
  }, 150);
  //
  //Creates a new element to display the top portion of the
  //  updated time and places it "under" the topmost element
  let spanTop = makeElement("span", `${time}T${unit}`, "top");
  spanTop.innerHTML = time;
  target.insertBefore(spanTop, target.childNodes[0]);

  return time;
}

let refreshInterval = setInterval(function() {
  //
  //Checks the time every 10 milliseconds
  let time = new Date();
  
  let newDays = Math.floor((targetDate.getTime() - time.getTime()) / 1000 / (3600 * 24))
  let newHours = Math.floor((targetDate.getTime() - time.getTime()) / 1000 / 3600) % 24
  let newMinutes = Math.floor((targetDate.getTime() - time.getTime()) / 1000 % 3600 / 60)
  let newSeconds = Math.floor((targetDate.getTime() - time.getTime()) / 1000) % 60
  console.log(newSeconds)
  //
  //Updates the seconds
  if (currentSeconds !== newSeconds.toString(10).padStart(2, 0)) {
    currentSeconds = changeTime(currentSeconds, newSeconds, seconds, "sec");
  }
  //
  //Updates the minutes
  if (currentMinutes !== newMinutes.toString(10).padStart(2, 0)) {
    currentMinutes = changeTime(currentMinutes, newMinutes, minutes, "min");
  }
  //
  //Updates the hours
  if (currentHours !== newHours.toString(10).padStart(2, 0)) {
    currentHours = changeTime(currentHours, newHours, hours, "hr");
  }
  //Updates the hours
  if (currentDays !== newDays.toString(10).padStart(2, 0)) {
    currentDays = changeTime(currentDays, newDays, days, "day");
  }

}, 10);

document.addEventListener('DOMContentLoaded', function () {
    const openButton = document.getElementById('openButton');
    const embeddedWindow = document.getElementById('embeddedWindow');

    let closeButton;

    openButton.addEventListener('click', function () {
        // Show the embedded window
        embeddedWindow.style.display = 'block';
        
        // Load content into the embedded window
        embeddedWindow.innerHTML = `
            <button id="closeButton"><img class="close" src="sources/close.png"></button>
            <iframe src="embedded_content.html" width="100%" height="100%" frameborder="0"></iframe>
        `;

        closeButton = document.getElementById('closeButton');
        closeButton.addEventListener('click', closeEmbeddedWindow);
    });

    function closeEmbeddedWindow() {
        // Hide the embedded window
        embeddedWindow.style.display = 'none';
    }
});