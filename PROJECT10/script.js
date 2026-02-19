// CONFIGURATION
const config = {
    frameCount: 192,
    urlPrefix: 'frames/frame_',
    urlSuffix: '.jpg',
    padLength: 3,
    priorityFrames: 30 
};

const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");
const state = { frame: 0 };
const images = [];

// Helper: Current Frame URL
const currentFrame = i => `${config.urlPrefix}${i.toString().padStart(config.padLength, '0')}${config.urlSuffix}`;

// 1. SMART PRELOADING
images.length = config.frameCount;

const loadImage = (index) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = currentFrame(index + 1);
        img.onload = () => {
            images[index] = img;
            resolve();
        };
        img.onerror = () => {
            resolve();
        };
    });
};

async function startPreloading() {
    const loaderText = document.getElementById("progress");
    let loadedCount = 0;

    // A. Priority Load
    const priorityPromises = [];
    for (let i = 0; i < config.priorityFrames; i++) {
        priorityPromises.push(loadImage(i).then(() => {
            loadedCount++;
            if(loaderText) loaderText.innerText = Math.round((loadedCount / config.frameCount) * 100) + "%";
        }));
    }

    await Promise.all(priorityPromises);

    // B. Start Site
    init();

    // C. Background Load
    for (let i = config.priorityFrames; i < config.frameCount; i++) {
        loadImage(i);
    }
}

function init() {
    // Hide Loader
    gsap.to("#loader", { opacity: 0, duration: 0.5, onComplete: () => {
        const loader = document.getElementById("loader");
        if(loader) loader.style.display = "none";
    }});
    
    gsap.registerPlugin(ScrollTrigger);

    // A. Video Scroll Animation
    gsap.to(state, {
        frame: config.frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: ".zone-assembly",
            start: "top top",
            end: "bottom bottom",
            scrub: 0, 
        },
        onUpdate: () => requestAnimationFrame(render)
    });

    // B. Staggered Text Reveals
    const stages = [
        { id: "#stage-1", start: "top center" },
        { id: "#stage-2", start: "top center" },
        { id: "#stage-3", start: "top center" },
        { id: "#stage-4", start: "center center" }
    ];

    stages.forEach((stage, index) => {
        const element = document.querySelector(stage.id);
        if(!element) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: stage.id,
                start: "top 60%",
                end: "bottom 40%",
                toggleActions: "play reverse play reverse",
            }
        });

        tl.fromTo(element.querySelectorAll("h2, h1"), 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.8 }
        ).fromTo(element.querySelectorAll("p"), 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.8 }, 
            "-=0.6"
        );
    });

    // D. Initialize Tilt
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), { 
        max: 15, speed: 400, glare: true, "max-glare": 0.1, gyroscope: true
    });

    // E. Gaming Slider
    const sliderContainer = document.getElementById('slider-container');
    const dragLeft = document.getElementById('drag-left');
    const handle = document.getElementById('drag-handle');

    if (sliderContainer && dragLeft && handle) {
        const updateSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            let x = clientX - rect.left;
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            const percentage = (x / rect.width) * 100;
            
            gsap.to(dragLeft, { width: `${percentage}%`, duration: 0.1, ease: "none" });
            gsap.to(handle, { left: `${percentage}%`, duration: 0.1, ease: "none" });
        };

        sliderContainer.addEventListener('mousemove', (e) => updateSlider(e.clientX));
        sliderContainer.addEventListener('touchmove', (e) => updateSlider(e.touches[0].clientX));
    }

    // F. Benchmark Charts
    const bars = document.querySelectorAll('.bar-fill');
    if (bars.length > 0) {
        gsap.utils.toArray(bars).forEach(bar => {
            gsap.to(bar, {
                width: bar.getAttribute('data-width'),
                duration: 1.5,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    // G. AI TERMINAL TYPING EFFECT
    const terminalTrigger = document.querySelector(".zone-ai-terminal");
    if (terminalTrigger) {
        ScrollTrigger.create({
            trigger: ".zone-ai-terminal",
            start: "top 70%",
            onEnter: () => runTerminalSequence()
        });
    }

    // H. ISP VIEWFINDER LOGIC
    const shutterBtn = document.getElementById("shutter-btn");
    const viewfinder = document.getElementById("viewfinder");
    const flash = document.querySelector(".flash-whiteout");

    if (shutterBtn && viewfinder) {
        shutterBtn.addEventListener("click", () => {
            if(flash) gsap.to(flash, { opacity: 1, duration: 0.1, yoyo: true, repeat: 1 });
            setTimeout(() => {
                viewfinder.classList.add("captured");
                const label = document.querySelector(".cam-label");
                if(label) {
                    label.innerText = "PROCESSING COMPLETE";
                    label.style.color = "#00f3ff";
                }
            }, 100);
            setTimeout(() => {
                viewfinder.classList.remove("captured");
                const label = document.querySelector(".cam-label");
                if(label) {
                    label.innerText = "TAP TO CAPTURE";
                    label.style.color = "#666";
                }
            }, 4000);
        });
    }

    // J. 3D DIAL HUD LOGIC (Grouped)
    const hudItems = document.querySelectorAll(".hud-item");
    const radius = 25; // Degrees of rotation per item

    // Format: { id: "hud-index", trigger: "selector" }
    const groups = [
        { idx: 0, selector: ".zone-assembly" },       // 01. GENESIS
        { idx: 1, selector: ".zone-details" },        // 02. MATRIX
        { idx: 2, selector: ".zone-gaming" },         // 03. VISUALS
        { idx: 3, selector: ".zone-ai-terminal" },    // 04. NEURAL
        { idx: 4, selector: ".zone-3d-layers" }       // 05. LOGIC
    ];

    groups.forEach((group) => {
        ScrollTrigger.create({
            trigger: group.selector,
            start: "top center", 
            end: "bottom center",
            onEnter: () => updateDial(group.idx),
            onEnterBack: () => updateDial(group.idx)
        });
    });

    function updateDial(activeIndex) {
        hudItems.forEach((item, index) => {
            const diff = index - activeIndex;
            const angle = diff * radius;
            const opacity = Math.max(0.1, 1 - Math.abs(diff) * 0.4);
            const scale = Math.max(0.8, 1 - Math.abs(diff) * 0.1);
            
            const color = (diff === 0) ? "#00f3ff" : "rgba(255,255,255,0.2)";
            const textShadow = (diff === 0) ? "0 0 15px rgba(0,243,255,0.6)" : "none";
            const fontWeight = (diff === 0) ? "700" : "500";

            gsap.to(item, {
                rotateX: -angle, 
                y: diff * 10,
                scale: scale,
                opacity: opacity,
                color: color,
                textShadow: textShadow,
                fontWeight: fontWeight,
                duration: 0.6,
                ease: "back.out(1.7)"
            });
        });
    }

    hudItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            const targetSelector = groups[index].selector;
            const target = document.querySelector(targetSelector);
            if(target) {
                window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
            }
        });
    });
    
    updateDial(0);

    // K. FOOTER INTERACTION (Fade out HUD)
    const footer = document.querySelector('.mega-footer');
    const hud = document.querySelector('.hud-sidebar');

    if (footer && hud) {
        ScrollTrigger.create({
            trigger: footer,
            start: "top 80%", 
            end: "top 50%",   
            onEnter: () => gsap.to(hud, { opacity: 0, pointerEvents: "none", duration: 0.3 }),
            onLeaveBack: () => gsap.to(hud, { opacity: 1, pointerEvents: "all", duration: 0.3 })
        });
    }

    // L. 3D LAYER ROTATION (INTERACTIVE CYLINDER ORBIT)
    const layerZone = document.querySelector(".zone-3d-layers");
    const layerStage = document.querySelector(".layer-stage");
    
    if (layerZone && layerStage) {
        gsap.set(layerStage, { rotateX: 60, rotateZ: 0, rotateY: 0 });

        layerZone.addEventListener("mousemove", (e) => {
            const pct = (e.clientX / window.innerWidth) - 0.5;
            const rotateY = pct * 360;

            gsap.to(layerStage, {
                rotateY: rotateY,   
                rotateX: 40,        
                rotateZ: 0,         
                duration: 1.5,      
                ease: "power2.out"
            });
        });

        layerZone.addEventListener("mouseleave", () => {
            gsap.to(layerStage, {
                rotateY: "+=45", 
                duration: 2,
                ease: "power2.out"
            });
        });
    }
    // Initial Render
    render();
}

function runTerminalSequence() {
    const promptEl = document.getElementById("typewriter-prompt");
    const responseBlock = document.getElementById("ai-response-block");
    const responseEl = document.getElementById("typewriter-response");
    
    if(!promptEl || !responseEl) return;

    promptEl.innerHTML = "";
    responseEl.innerHTML = "";
    responseBlock.classList.add("hidden");

    const promptText = "Write a Python script to optimize the neural network matrix.";
    const aiText = `import torch\nimport torch.nn as nn\n\nclass HexagonOptimizer(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.npu_acceleration = True\n        self.matrix = torch.randn(1024, 1024)\n\n    def forward(self, x):\n        # Optimized for Snapdragon 8 Elite\n        return torch.matmul(self.matrix, x) * 37.5\n\n# Optimization Complete. Efficiency +40%.`;

    let i = 0;
    const typePrompt = () => {
        if (i < promptText.length) {
            promptEl.innerHTML += promptText.charAt(i);
            i++;
            setTimeout(typePrompt, 50); 
        } else {
            setTimeout(() => {
                responseBlock.classList.remove("hidden");
                typeAI();
            }, 500);
        }
    };

    let j = 0;
    const typeAI = () => {
        if (j < aiText.length) {
            responseEl.innerHTML += aiText.substring(j, j+5); 
            j+=5;
            setTimeout(typeAI, 10); 
        }
    };

    typePrompt();
}

function render() {
    if (!images[Math.round(state.frame)]) return;
    const img = images[Math.round(state.frame)];
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const centerShift_x = (canvas.width - img.width * scale) / 2;
    const centerShift_y = (canvas.height - img.height * scale) / 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * scale, img.height * scale);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    requestAnimationFrame(render);
});
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

startPreloading();