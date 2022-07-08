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
let year = "";

function playPauseMedia() {
    if(media.paused) {
      run = true;
      button.setAttribute('data-icon','u');
      media.playbackRate = 1;
      media.play();
      startAnimation();
    } else {
        stopMedia() 
    }
}

function stopMedia() {
    console.log("stopMedia");
    run = false;
    media.pause();
    media.currentTime = 0;
}

function handleKey(e) {
    if (run) return;
    e = e || window.event;
    if (e.keyCode === 27 || e.keyCode === 46 || e.keyCode === 8 || e.keyCode === 110) {
        year = "";
        bc = false;
    }
    else if (e.key === '-') year = "" + (Number(year) * -1);
    else if (e.keyCode === 13) playPauseMedia();
    else if(!isNaN(e.key)) year += e.key;

    updateUi(year);
}

function startAnimation() {
    runAnimation.startValue = 2022;
    let endYear = runAnimation.endValue = Number(year);
    year = "";
    runAnimation.ticks = 0;
    runAnimation.interval = 1 / 400;
    runAnimation.timeout = 100;
    runAnimation.diff = endYear - runAnimation.startValue;
    runAnimation.future = endYear > runAnimation.startValue;
    runAnimation.diff = Math.abs(runAnimation.diff);
    runAnimation();
}

function runAnimation() {
    if (!run) return;
    if (runAnimation.ticks >= 1) {
        stopMedia();
        updateUi(runAnimation.endValue - 1)
        setTimeout(function() { updateUi(runAnimation.endValue); }, runAnimation.timeout);
        return;
    }

    runAnimation.ticks = runAnimation.ticks + runAnimation.interval;
    let diff = (ParametricBlend(runAnimation.ticks) * runAnimation.diff);
    let calculated = runAnimation.future ? runAnimation.startValue + diff : runAnimation.startValue - diff;
    let calculatedYear = Math.round(calculated);

    updateUi(calculatedYear);

    if (runAnimation.ticks > 0.8) media.playbackRate = 0.5;
    if (runAnimation.ticks > 0.9) media.playbackRate = 0.2;

    setTimeout(runAnimation, runAnimation.timeout);
}

function updateUi(value) {
    let bc = value < 0;
    yearElement.innerHTML = Math.abs(value);
    bcElement.innerHTML = bc ? '-' : '';
    if (bc) dateElement.classList.add('bc');
    else dateElement.classList.remove('bc');
    console.log("show year: " + yearElement.innerHTML);
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