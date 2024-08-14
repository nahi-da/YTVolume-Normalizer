browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "ready") {
        const elem_ready = document.getElementById("ready_state");
        elem_ready.textContent = "Ready";
        const elem_toggle_input = document.getElementById("toggle");
        const elem_volume_input = document.getElementById("volume");
        const elem_volume_val = document.getElementById("volume_val");
        const elem_threshold_input = document.getElementById("threshold");
        const elem_threshold_val = document.getElementById("threshold_val");
        const elem_knee_input = document.getElementById("knee");
        const elem_knee_val = document.getElementById("knee_val");
        const elem_ratio_input = document.getElementById("ratio");
        const elem_ratio_val = document.getElementById("ratio_val");
        const elem_attack_input = document.getElementById("attack");
        const elem_attack_val = document.getElementById("attack_val");
        const elem_release_input = document.getElementById("release");
        const elem_release_val = document.getElementById("release_val");
        const elem_reduction_progress = document.getElementById("reduction");
        const elem_reduction_val = document.getElementById("reduction_val");

        elem_toggle_input.checked = localStorage.getItem("state");
        elem_volume_input.value = localStorage.getItem("gain") * 100;
        elem_volume_val.textContent = localStorage.getItem("gain") * 100;
        elem_threshold_input.value = localStorage.getItem("threshold");
        elem_threshold_val.textContent = localStorage.getItem("threshold");
        elem_knee_input.value = localStorage.getItem("knee");
        elem_knee_val.textContent = localStorage.getItem("knee");
        elem_ratio_input.value = localStorage.getItem("ratio");
        elem_ratio_val.textContent = localStorage.getItem("ratio");
        elem_attack_input.value = localStorage.getItem("attack");
        elem_attack_val.textContent = localStorage.getItem("attack");
        elem_release_input.value = localStorage.getItem("release");
        elem_release_val.textContent = localStorage.getItem("release");

        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {
                type: "setup",
                gain: localStorage.getItem("gain"),
                threshold: localStorage.getItem("threshold"),
                knee: localStorage.getItem("knee"),
                ratio: localStorage.getItem("ratio"),
                attack: localStorage.getItem("attack"),
                release: localStorage.getItem("release"),
                state: localStorage.getItem("state")
            });
        });

        elem_toggle_input.addEventListener("change", function(e) {
            if (elem_toggle_input.checked) {
                browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                    browser.tabs.sendMessage(tabs[0].id, {type: "enable_compressor"});
                });
                localStorage.setItem("state", true);
            } else {
                browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                    browser.tabs.sendMessage(tabs[0].id, {type: "disable_compressor"});
                });
                localStorage.setItem("state", false);
            }
        });

        elem_volume_val.textContent = elem_volume_input.value;
        elem_volume_input.addEventListener("input", (event) => {
            elem_volume_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_gain", gain: event.target.value / 100});
            });
            localStorage.setItem("gain", event.target.value / 100);
        });
        elem_volume_input.addEventListener("wheel", function(event){
            if (event.deltaY < 0){
                elem_volume_input.valueAsNumber += 1;
            }else{
                elem_volume_input.value -= 1;
            }
            elem_volume_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_gain", gain: event.target.value / 100});
            });
            localStorage.setItem("gain", event.target.value / 100);
            event.preventDefault();
            event.stopPropagation();
        })

        elem_threshold_val.textContent = elem_threshold_input.value;
        elem_threshold_input.addEventListener("input", (event) => {
            elem_threshold_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_threshold", threshold: event.target.value});
            });
            localStorage.setItem("threshold", event.target.value);
        });
        elem_threshold_input.addEventListener("wheel", function(event){
            if (event.deltaY < 0){
                elem_threshold_input.valueAsNumber += 1;
            }else{
                elem_threshold_input.value -= 1;
            }
            elem_threshold_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_threshold", threshold: event.target.value});
            });
            localStorage.setItem("threshold", event.target.value);
            event.preventDefault();
            event.stopPropagation();
        })

        elem_knee_val.textContent = elem_knee_input.value;
        elem_knee_input.addEventListener("input", (event) => {
            elem_knee_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_knee", knee: event.target.value});
            });
            localStorage.setItem("knee", event.target.value);
        });
        elem_knee_input.addEventListener("wheel", function(event){
            if (event.deltaY < 0){
                elem_knee_input.valueAsNumber += 1;
            }else{
                elem_knee_input.value -= 1;
            }
            elem_knee_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_knee", knee: event.target.value});
            });
            localStorage.setItem("knee", event.target.value);
            event.preventDefault();
            event.stopPropagation();
        })

        elem_ratio_val.textContent = elem_ratio_input.value;
        elem_ratio_input.addEventListener("input", (event) => {
            elem_ratio_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_ratio", ratio: event.target.value});
            });
            localStorage.setItem("ratio", event.target.value);
        });
        elem_ratio_input.addEventListener("wheel", function(event){
            if (event.deltaY < 0){
                elem_ratio_input.valueAsNumber += 1;
            }else{
                elem_ratio_input.value -= 1;
            }
            elem_ratio_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_ratio", ratio: event.target.value});
            });
            localStorage.setItem("ratio", event.target.value);
            event.preventDefault();
            event.stopPropagation();
        })

        elem_attack_val.textContent = elem_attack_input.value;
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Shift') {
                elem_attack_input.step = '0.001';
            }
        });
        document.addEventListener('keyup', function(event) {
            if (event.key === 'Shift') {
                elem_attack_input.step = '0.01';
            }
        });
        elem_attack_input.addEventListener("input", (event) => {
            elem_attack_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_attack", attack: event.target.value});
            });
            localStorage.setItem("attack", event.target.value);
        });
        elem_attack_input.addEventListener("wheel", function(event){
            if (event.deltaY < 0){
                if (event.shiftKey) {
                    elem_attack_input.valueAsNumber += 0.001;
                } else {
                    elem_attack_input.valueAsNumber += 0.01;
                }
            } else {
                if (event.shiftKey) {
                    elem_attack_input.value -= 0.001;
                } else {
                    elem_attack_input.value -= 0.01;
                }
            }
            elem_attack_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_attack", attack: event.target.value});
            });
            localStorage.setItem("attack", event.target.value);
            event.preventDefault();
            event.stopPropagation();
        })

        elem_release_val.textContent = elem_release_input.value;
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Shift') {
                elem_release_input.step = '0.001';
            }
        });
        document.addEventListener('keyup', function(event) {
            if (event.key === 'Shift') {
                elem_release_input.step = '0.01';
            }
        });
        elem_release_input.addEventListener("input", (event) => {
            elem_release_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_release", release: event.target.value});
            });
            localStorage.setItem("release", event.target.value);
        });
        elem_release_input.addEventListener("wheel", function(event){
            if (event.deltaY < 0){
                if (event.shiftKey) {
                    elem_release_input.valueAsNumber += 0.001;
                } else {
                    elem_release_input.valueAsNumber += 0.01;
                }
            } else {
                if (event.shiftKey) {
                    elem_release_input.value -= 0.001;
                } else {
                    elem_release_input.value -= 0.01;
                }
            }
            elem_release_val.textContent = event.target.value;
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "set_release", release: event.target.value});
            });
            localStorage.setItem("release", event.target.value);
            event.preventDefault();
            event.stopPropagation();
        })

        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {type: "get_value"}).then(response => {
                elem_reduction_val.textContent = response.reduction.toFixed(0);
                elem_reduction_progress.value = response.reduction.toFixed(0) * -1;
            });
        });
        browser.runtime.onMessage.addListener((request) => {
            if (request.type === "send_reduction") {
                elem_reduction_val.textContent = request.reduction.toFixed(0);
                elem_reduction_progress.value = request.reduction.toFixed(0) * -1;
            }
        });

    }
});
browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {type: "popup_open"});
});
browser.runtime.sendMessage({type: "popupOpened"});
const port = browser.runtime.connect();