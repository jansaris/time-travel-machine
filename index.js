//Elements
const media = document.querySelector('video');
const audio = document.querySelector('audio');
const set = document.getElementById('set');
const travel = document.getElementById('travel');
const startInput = document.getElementById('start');
const endInput = document.getElementById('end');
const yearSpan = document.getElementById('yearsSpan');
const bcElement = document.getElementById('bc');
const dateElement = document.getElementById('date');
const inputElement = document.getElementById('input');
const animationElement = document.getElementById('animation');
//Images
let locations = ['left-bottom', 'right-bottom'];
locations.index = 0;
let images = [];
addImage('prehistory', -7000, -4500)
addImage('hunters', -4000, -3000)
addImage('romans', -2000, 0)
addImage('knights', 500, 1000)
addImage('voc', 1250, 1800)
addImage('modern', 1950, 2200)
addImage('ufo', 2300, 3000)

//Listeners
set.addEventListener('click', setData);
travel.addEventListener('click', playPauseMedia);
media.addEventListener('ended', stopMedia);
animationElement.addEventListener('click', () => { if (!run) toggleInput(); });

//Force landscape
(async () => {
    try {
        await screen.orientation.lock('landscape');
    }
    catch {
        //Ignore
    }
})();

let run = false;

function playPauseMedia() {
    if(media.paused) {
      run = true;
      audio.currentTime = 10;
      audio.volume = 0;
      audio.play();
      fadeInAudio();
      media.currentTime = 0;
      media.playbackRate = 1;
      media.play();
      toggleInput();
      runAnimation();
      travel.style.display = "none";
    } else {
      stopMedia() 
    }
}

function fadeInAudio() {
    if (audio.volume >= 0.95) return;
    audio.volume = audio.volume + 0.1;
    setTimeout(fadeInAudio, 100);
}

function fadeOutAudio() {
    if (audio.volume <= 0.05) {
        audio.pause();
        return;
    }
    audio.volume = audio.volume - 0.1;
    setTimeout(fadeOutAudio, 100);
}
 
function stopMedia() {
    run = false;
    media.pause();
    fadeOutAudio();
}

function setData() {
    runAnimation.startValue = Number(startInput.value);
    let endYear = runAnimation.endValue = Number(endInput.value);
    runAnimation.ticks = 0;
    runAnimation.interval = 1 / 360;
    runAnimation.timeout = 100;
    runAnimation.diff = endYear - runAnimation.startValue;
    runAnimation.future = endYear > runAnimation.startValue;
    runAnimation.diff = Math.abs(runAnimation.diff);
    animationElement.style.display = "block";
    inputElement.style.display = "none";
    updateUi(runAnimation.startValue);
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
    let calculatedYear = runAnimation.future ? Math.ceil(calculated) : Math.floor(calculated);

    updateUi(calculatedYear);
    updateImage(calculatedYear);

    if (runAnimation.ticks > 0.8) media.playbackRate = 0.5;
    if (runAnimation.ticks > 0.9) media.playbackRate = 0.2;

    setTimeout(runAnimation, runAnimation.timeout);
}

function updateUi(value) {
    let bc = value < 0;
    yearSpan.innerHTML = Math.abs(value);
    bcElement.innerHTML = bc ? '-' : '';
    if (bc) dateElement.classList.add('bc');
    else dateElement.classList.remove('bc');
}

function updateImage(value) {
    images.forEach(image => {
        if (image.enabled && !(value > image.start && value < image.end)) {
            image.enabled = false;
            hideImage(image, 0.9);
        }
        else if (!image.enabled && value > image.start && value < image.end) {
            image.enabled = true;
            showImage(image, 0.1);
        }
    });
}

function showImage(image, opacity) {
    image.style.opacity = opacity;
    if (opacity > 0.95) return;
    setTimeout(() => showImage(image, opacity + 0.1), 100);
}

function hideImage(image, opacity) {
    image.style.opacity = opacity;
    if (opacity < 0.05) return;
    setTimeout(() => hideImage(image, opacity - 0.1), 100);
}

function toggleInput() {
    if (run) {
        inputElement.style.display = 'none';
        animationElement.style.display = 'block';
    } else {
        inputElement.style.display = 'block';
        animationElement.style.display = 'none';
    }
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

function addImage(imageId, start, end) {
    let image = document.getElementById(imageId);
    image.start = start;
    image.end = end;
    image.enabled = false;
    image.style.opacity = 0;
    image.classList.add(locations[locations.index]);
    locations.index++;
    if (locations.index == locations.length) locations.index = 0;
    images.push(image);
}