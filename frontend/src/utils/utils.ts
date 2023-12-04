function playAudio(audioUrl: string) {
    const audioCtx = new AudioContext();
    const audio = new Audio(audioUrl);
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(audioCtx.destination);
    audio.play();
}

export {
    playAudio
}