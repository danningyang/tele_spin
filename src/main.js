class JSBridge {
    constructor(that) {
        if (that === undefined) {
            throw "global is undefined";
        }
        this.global = that
        var container = document.querySelector("#unity-container");
        var canvas = document.querySelector("#unity-canvas");
        var loadingBar = document.querySelector("#unity-loading-bar");
        var progressBarFull = document.querySelector("#unity-progress-bar-full");
        var warningBanner = document.querySelector("#unity-warning");
        this.elements = {
            container: container,
            canvas: canvas,
            loadingBar: loadingBar,
            progressBarFull: progressBarFull,
            warningBanner: warningBanner
        }


        this.buildUrl = "Build";
        this.loaderUrl = this.buildUrl + "/spin-h5.loader.js";
        this.unityConfig = {
            dataUrl: this.buildUrl + "/spin-h5.data",
            frameworkUrl: this.buildUrl + "/spin-h5.framework.js",
            codeUrl: this.buildUrl + "/spin-h5.wasm",
            streamingAssetsUrl: "StreamingAssets",
            companyName: "DefaultCompany",
            productName: "PandaMaster",
            productVersion: "0.1",
            showBanner: this.msg,
        };
    }

    init() {
        console.log("js bridge init");
        this.elements.container.className = "unity-mobile";
        // this.elements.canvas.devicePixelRatio = 1;
        this.elements.loadingBar.style.display = "block";
        this.loadScript(this.loaderUrl, () => {
            this.createUnityInstance()
        })
    }

    createUnityInstance() {
        this.global.createUnityInstance(
            this.elements.canvas,
            this.unityConfig,
            (progress) => {
                this.elements.progressBarFull.style.width = 100 * progress + "%";
            }).then((unityInstance) => {
                this.unityInstance = unityInstance;
                this.elements.loadingBar.style.display = "none";
                // this.elements.fullscreenButton.onclick = () => {
                //     this.unityInstance.SetFullscreen(1);
                // };
            }).catch(alert);
    }

    loadScript(url, callback) {
        var script = document.createElement("script");
        script.src = url;
        script.onload = callback
        document.body.appendChild(script);
    }

    msg(msg, type, time = 3000) {
        const warningBanner = this.elements.warningBanner;
        function updateBannerVisibility() {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
            if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
            setTimeout(function () {
                warningBanner.removeChild(div);
                updateBannerVisibility();
            }, time);
        }
        updateBannerVisibility();
    }
}
const jsb = new JSBridge(window)




function debug() {
    const box = mkEle("div", "", document.body)
    box.style.position = "fixed"
    box.style.top = 0
    box.style.right = 0
    box.style.zIndex = 100
    box.style.display = 'flex'
    box.style.flexDirection = 'column'
    box.style.gap = "3px"
    const btn = mkEle("button", "alert message", box)
    btn.onclick = () => {
        jsb.msg("hello")
    }
    const btn2 = mkEle("button", "get User Info", box)
    btn2.onclick = () => {
        jsb.msg(JSON.stringify(window.Telegram.WebApp.initData))
    }

    const btn3 = mkEle("button", "share", box)
    btn3.onclick = () => {
        let tmaUrl = "https://t.me/tele_spin_bot".replace(/^https?:\/\//, "");
        if (!tmaUrl) return;
        if (data) {
            tmaUrl += `?startapp=${btoa(JSON.stringify(data))}`;
        }
        const path_full = `/share/url?url=${tmaUrl}&text=${encodeURI(msg)}`;
        window.Telegram.WebApp.openTelegramLink(path_full)
    }
}


function mkEle(type, text, father) {
    var ele = document.createElement(type);
    if (text) {
        ele.innerText = text
    }
    if (father) {
        father.appendChild(ele)
    }
    return ele
}


jsb.init()
debug()





function shareTextToSession(msg, data) {

    // if (await isTMA()) {
    //     if (isWebExpansion()) {
    //         postEvent("web_app_open_link", {
    //             url: "https://t.me" + path_full,
    //         });
    //         return;
    //     }
    //     postEvent("web_app_open_tg_link", {
    //         path_full,
    //     });
    // } else {
    //     window.open("https://t.me" + path_full, "_blank");
    // }
}