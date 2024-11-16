function waitForElem(selector, parent) {
    var time = 0;
    return new Promise(function (resolve, reject) {
        const interval = setInterval(function () {
            if (time++ > 1000) {
                clearInterval(interval);
                console.error(`[TestExt] not found '${selector}'`);
                return reject(null);
            }
            const elem = parent.querySelector(selector);
            if (elem) {
                clearInterval(interval);
                console.log(`[TestExt] found '${selector}'`);
                return resolve(elem);
            } else {
                console.log(`[TestExt] wait for '${selector}'`);
            }
        }, 5);
    });
}


class Normalizer {
    constructor(videoElem) {
        this.audioCtx = new AudioContext();

        this.inputGainNode = this.audioCtx.createGain();
        this.inputGainNode.gain.value = 1.0;

        this.compressor = this.audioCtx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-50, this.audioCtx.currentTime);
        this.compressor.knee.setValueAtTime(20, this.audioCtx.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.audioCtx.currentTime);
        this.compressor.attack.setValueAtTime(0, this.audioCtx.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.audioCtx.currentTime);

        this.outputGainNode = this.audioCtx.createGain();
        this.outputGainNode.gain.value = 1.0;

        this.setVideoElement(videoElem);
        this.source.connect(this.inputGainNode);
        this.outputGainNode.connect(this.audioCtx.destination);
        this.state = false;
    }

    setVideoElement(videoElem) {
        if (this.source) {
            this.source.disconnect();
        }
        this.source = this.audioCtx.createMediaElementSource(videoElem);
    }

    enableCompressor() {
        if (this.source) {
            this.inputGainNode.disconnect();
            this.inputGainNode.connect(this.compressor);
            this.compressor.connect(this.outputGainNode);
            this.state = true;
        }
    }

    disableCompressor() {
        if (this.source) {
            this.inputGainNode.disconnect();
            this.compressor.disconnect();
            this.inputGainNode.connect(this.outputGainNode);
            this.state = false;
        }
    }
}

var popup_closed = false;

(async function () {
    if (window.self !== window.top) {
        if (window.location.href.includes('youtube.com/embed')) {
            console.log(`[TestExt] ${window.location.href}`);
            console.log("[TestExt] load");
            var videoElem = await waitForElem(".html5-main-video", document);
            if (videoElem) {
                var normalizer = new Normalizer(videoElem);
                browser.runtime.sendMessage({type: "require_params"}).then(response => {
                    normalizer.inputGainNode.gain.value = response.input_gain;
                    normalizer.outputGainNode.gain.value = response.output_gain;
                    normalizer.compressor.threshold.setValueAtTime(response.threshold, normalizer.audioCtx.currentTime);
                    normalizer.compressor.knee.setValueAtTime(response.knee, normalizer.audioCtx.currentTime);
                    normalizer.compressor.ratio.setValueAtTime(response.ratio, normalizer.audioCtx.currentTime);
                    normalizer.compressor.attack.setValueAtTime(response.attack, normalizer.audioCtx.currentTime);
                    normalizer.compressor.release.setValueAtTime(response.release, normalizer.audioCtx.currentTime);
                    if (response.state && !normalizer.state) {
                        normalizer.enableCompressor();
                    }
                    if (!response.state && normalizer.state) {
                        normalizer.disableCompressor();
                    }
                });
                browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
                    if (message.type === "enable_compressor") {
                        normalizer.enableCompressor();
                    }
                    if (message.type === "disable_compressor") {
                        normalizer.disableCompressor();
                    }
                    if (message.type === "set_input_gain") {
                        normalizer.inputGainNode.gain.value = message.input_gain;
                    }
                    if (message.type === "set_output_gain") {
                        normalizer.outputGainNode.gain.value = message.output_gain;
                    }
                    if (message.type === "set_threshold") {
                        normalizer.compressor.threshold.setValueAtTime(message.threshold, normalizer.audioCtx.currentTime);
                    }
                    if (message.type === "set_knee") {
                        normalizer.compressor.knee.setValueAtTime(message.knee, normalizer.audioCtx.currentTime);
                    }
                    if (message.type === "set_ratio") {
                        normalizer.compressor.ratio.setValueAtTime(message.ratio, normalizer.audioCtx.currentTime);
                    }
                    if (message.type === "set_attack") {
                        normalizer.compressor.attack.setValueAtTime(message.attack, normalizer.audioCtx.currentTime);
                    }
                    if (message.type === "set_release") {
                        normalizer.compressor.release.setValueAtTime(message.release, normalizer.audioCtx.currentTime);
                    }
                    if (message.type === "get_value") {
                        sendResponse({
                            input_gain: normalizer.inputGainNode.gain.value,
                            output_gain: normalizer.outputGainNode.gain.value,
                            threshold: normalizer.compressor.threshold.value,
                            knee: normalizer.compressor.knee.value,
                            ratio: normalizer.compressor.ratio.value,
                            attack: normalizer.compressor.attack.value,
                            release: normalizer.compressor.release.value,
                            reduction: normalizer.compressor.reduction,
                            state: normalizer.state
                        });
                    }
                    if (message.type === "setup") {
                        normalizer.inputGainNode.gain.value = message.input_gain;
                        normalizer.outputGainNode.gain.value = message.output_gain;
                        normalizer.compressor.threshold.setValueAtTime(message.threshold, normalizer.audioCtx.currentTime);
                        normalizer.compressor.knee.setValueAtTime(message.knee, normalizer.audioCtx.currentTime);
                        normalizer.compressor.ratio.setValueAtTime(message.ratio, normalizer.audioCtx.currentTime);
                        normalizer.compressor.attack.setValueAtTime(message.attack, normalizer.audioCtx.currentTime);
                        normalizer.compressor.release.setValueAtTime(message.release, normalizer.audioCtx.currentTime);
                        if (message.state && !normalizer.state) {
                            normalizer.enableCompressor();
                        }
                        if (!message.state && normalizer.state) {
                            normalizer.disableCompressor();
                        }
                    }
                    if (message.type === "popupClosed") {
                        popup_closed = true;
                    }
                    if (message.type === "popup_open") {
                        popup_closed = false;
                        browser.runtime.sendMessage({type: "ready"});
                        function updateReduction() {
                            browser.runtime.sendMessage({type: "send_reduction", reduction: normalizer.compressor.reduction});
                            if (!popup_closed) {
                                requestAnimationFrame(updateReduction);
                            }
                        }
                        updateReduction();
                    }
                });
                const observer = new MutationObserver(async function (mutations) {
                    if (videoElem === null) {
                        var new_videoElem = await waitForElem(".html5-main-video", document);
                        if (new_videoElem !== null) {
                            videoElem = new_videoElem;
                            normalizer.setVideoElement(videoElem);
                            if (normalizer.state) {
                                normalizer.enableCompressor();
                            } else {
                                normalizer.disableCompressor();
                            }
                        }
                    }
                });
                observer.observe(videoElem, {childList: true, subtree: true});
            }
        }
    }
})();
