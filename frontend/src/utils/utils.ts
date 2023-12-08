function playAudio(audioUrl: string) {
    const audioCtx = new AudioContext();
    const audio = new Audio(audioUrl);
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(audioCtx.destination);
    audio.play();
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export {
    playAudio, getRandomInt
}