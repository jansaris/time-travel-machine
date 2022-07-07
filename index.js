//Elements
const media = document.querySelector('video');
const button = document.querySelector('button');
const yearElement = document.getElementById('years');
const bcElement = document.getElementById('bc');
const dateElement = document.getElementById('date');

//Listeners
button.addEventListener('click', playPauseMedia);
media.addEventListener('ended', stopMedia);
document.addEventListener('keyup', handleKey);

let run = false;
let year = "2022";
let bc = false;

function playPauseMedia() {
    if(media.paused) {
      run = true;
      button.setAttribute('data-icon','u');
      media.play();
      startAnimation();
    } else {
        stopMedia() 
    }
}

function stopMedia() {
    run = false;
    media.pause();
    media.currentTime = 0;
    play.setAttribute('data-icon','P');
}

function handleKey(e) {
    if (run) return;
    e = e || window.event;
    if (e.keyCode === 27 || e.keyCode === 46 || e.keyCode === 8 || e.keyCode === 110) year = "";
    else if (e.key === '-') bc = !bc;
    else if(!isNaN(e.key)) year += e.key;
    updateBC();
    yearElement.innerHTML = year;
}

function startAnimation() {
    runAnimation.interval = 1 / 400;
    runAnimation.ticks = 0;
    runAnimation.timeout = 100;
    runAnimation.diff = 10000;
    runAnimation.startValue = 2022;
    runAnimation();
}

function runAnimation() {
    if (!run) return;
    if (runAnimation.ticks >= 1) return;
    runAnimation.ticks = runAnimation.ticks + runAnimation.interval;
    
    let year = Math.round(runAnimation.startValue - (ParametricBlend(runAnimation.ticks) * runAnimation.diff));
    if (year < 0) {
        bc = true;
        year = Math.abs(year);
    } else {
        bc = false;
    }
    updateBC();
    yearElement.innerHTML = year;
    setTimeout(runAnimation, runAnimation.timeout);
}

function updateBC() {
    bcElement.innerHTML = bc ? 'BC' : 'AC';
    if (bc) dateElement.classList.add('bc');
    else dateElement.classList.remove('bc');
}

function BezierBlend(t)
{
    return t * t * (3.0 - 2.0 * t);
}

function ParametricBlend(t)
{
    const sqt = t * t;
    return sqt / (2.0 * (sqt - t) + 1.0);
}