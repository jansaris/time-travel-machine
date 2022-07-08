//Elements
const media = document.querySelector('video');
const button = document.querySelector('button');
const yearInput = document.getElementById('yearsInput');
const yearSpan = document.getElementById('yearsSpan');
const bcElement = document.getElementById('bc');
const dateElement = document.getElementById('date');
const inputElement = document.getElementById('input');
const animationElement = document.getElementById('animation');

//Listeners
button.addEventListener('click', playPauseMedia);
media.addEventListener('ended', stopMedia);
yearInput.addEventListener('keydown', handleKey);
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
      media.currentTime = 0;
      media.playbackRate = 1;
      media.play();
      toggleInput();
      startAnimation();
    } else {
      stopMedia() 
    }
}

function stopMedia() {
    run = false;
    media.pause();
}

function handleKey(e) {
    if (run) return;
    e = e || window.event;
    if(isNaN(e.key)) {
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
    }
    if (e.keyCode === 27 || e.keyCode === 46 || e.keyCode === 8 || e.keyCode === 110) {
        yearInput.value = "";
        bc = false;
    }
    else if (e.key === '-') {
        if (yearInput.value === "") yearInput.value = "-";
        else if (yearInput.value === "-") yearInput.value = "";
        else yearInput.value = "" + (Number( yearInput.value) * -1);
    }
    else if (e.keyCode === 13) playPauseMedia();
}

function startAnimation() {
    runAnimation.startValue = 2022;
    let endYear = runAnimation.endValue = Number(yearInput.value);
    yearInput.value = "";
    runAnimation.ticks = 0;
    runAnimation.interval = 1 / 351;
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
    yearSpan.innerHTML = Math.abs(value);
    bcElement.innerHTML = bc ? '-' : '';
    if (bc) dateElement.classList.add('bc');
    else dateElement.classList.remove('bc');
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