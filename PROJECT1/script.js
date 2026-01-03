document.addEventListener('DOMContentLoaded', () => {
    // ---start  Scroll-to-Reveal Animation ---
    
    // Set up the options for the observer
    const observerOptions = {
        root: null, // use the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    // This function is called when an element enters or leaves the screen
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // If the element is on screen
            if (entry.isIntersecting) {
                // Add the class to trigger the animation
                entry.target.classList.add('is-visible');
                // Stop watching this element (animation only runs once)
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Find all elements you want to animate
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    
    // Tell the observer to watch each of them
    elementsToAnimate.forEach(el => observer.observe(el));

// Make sure this code is INSIDE your main DOMContentLoaded wrapper
// ---end  Scroll-to-Reveal Animation ---

    // --- Focal Length Selector Start ---

    // Select all the necessary elements for the focal length selector
    const selector = document.querySelector('.focal-length-selector');
    const focalButtons = document.querySelectorAll('.focal-btn');
    const zoomDisplay = document.querySelector('.zoom-display');
    const imageBoxes = document.querySelectorAll('.focal-image-box');

    /**
     * Updates the white sliding highlighter's position and size.
     * @param {HTMLElement} activeButton - The button that is currently active.
     */
    function updateHighlighter(activeButton) {
        if (!activeButton || !selector) return;

        // Get the horizontal position (left) and width of the active button
        const left = activeButton.offsetLeft;
        const width = activeButton.offsetWidth;

        // Set the CSS variables on the parent container.
        selector.style.setProperty('--highlighter-left', `${left}px`);
        selector.style.setProperty('--highlighter-width', `${width}px`);
    }

    /**
     * Handles all logic when a focal length button is clicked.
     * @param {HTMLElement} clickedButton - The button element that was clicked.
     */
    function handleFocalButtonClick(clickedButton) {
        // --- 1. Update Button Active State ---
        focalButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');

        // --- 2. Update Zoom Display Text ---
        const zoomText = clickedButton.dataset.zoom;
        if (zoomDisplay) {
            zoomDisplay.textContent = zoomText;
        }

        // --- 3. Update Visible Image ---
        const targetId = clickedButton.dataset.target;
        imageBoxes.forEach(box => box.classList.remove('active'));
        const targetBox = document.getElementById(targetId);
        if (targetBox) {
            targetBox.classList.add('active');
        }

        // --- 4. Update Highlighter Position ---
        updateHighlighter(clickedButton);
    }

    // --- Add Event Listeners for Focal Length Selector ---
    focalButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleFocalButtonClick(button);
        });
    });

    // --- Set Initial State for Focal Length Selector ---
    const initialActiveButton = document.querySelector('.focal-btn.active');
    if (initialActiveButton) {
        updateHighlighter(initialActiveButton);
    }

    // --- Focal Length Selector End ---


    // ----------------------------------------------------


    // --- Carousel Start ---

    // 1. Select all the necessary elements for the carousel
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrevBtn');
    const nextBtn = document.getElementById('carouselNextBtn');
    
    // Check if essential carousel elements exist
    if (track && prevBtn && nextBtn) {
        const slides = Array.from(track.children);
        
        if (slides.length > 0) {
            // 2. State Variables
            let currentIndex = 0;
            let slideOffsets = []; // To store the left offset of each slide

            /**
             * Calculates and stores the exact 'offsetLeft' for each slide.
             */
            function calculateSlideOffsets() {
                const firstSlideOffset = slides[0].offsetLeft;
                slideOffsets = slides.map(slide => slide.offsetLeft - firstSlideOffset);
                moveToSlide(currentIndex, false); // Snap to current slide
            }

            /**
             * Moves the carousel track to the target slide index.
             */
            function moveToSlide(targetIndex, animate = true) {
                const offset = slideOffsets[targetIndex];
                
                if (animate) {
                    track.style.transition = 'transform 0.5s ease-in-out';
                } else {
                    track.style.transition = 'none';
                }

                track.style.transform = `translateX(-${offset}px)`;
                currentIndex = targetIndex;
                updateButtonState();
            }

            /**
             * Disables or enables the Prev/Next buttons.
             */
            function updateButtonState() {
                prevBtn.disabled = (currentIndex === 0);
                nextBtn.disabled = (currentIndex === slides.length - 1);
            }

            // --- 3. Add Event Listeners for Carousel ---
            nextBtn.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    moveToSlide(currentIndex + 1);
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    moveToSlide(currentIndex - 1);
                }
            });

            window.addEventListener('resize', calculateSlideOffsets);

            // --- 4. Initial Setup for Carousel ---
            calculateSlideOffsets();
            updateButtonState();
        }
        
    } else {
        // This console.log is helpful for debugging if the carousel doesn't load
        console.log('Carousel elements (track, prevBtn, or nextBtn) not found. Skipping carousel setup.');
    }

    // --- Carousel End ---

    // --- Feature Selector Widget Start ---

    const featureButtons = document.querySelectorAll('.toggle-btn');
    const slider = document.querySelector('.toggle-slider');
    const featurePanels = document.querySelectorAll('.feature-content');
    const descriptionPanels = document.querySelectorAll('.description-content');

    // Check if all elements for this widget exist
    if (featureButtons.length > 0 && slider && featurePanels.length > 0 && descriptionPanels.length > 0) {

        /**
         * Moves the white sliding background for the feature selector.
         * @param {HTMLElement} activeButton - The button that is currently active.
         */
        function moveFeatureSlider(activeButton) {
            if (!activeButton) return;
            const left = activeButton.offsetLeft;
            const width = activeButton.offsetWidth;

            // Apply styles to the slider element
            slider.style.left = `${left}px`;
            slider.style.width = `${width}px`;
        }

        /**
         * Handles logic for clicking a feature toggle button.
         * @param {HTMLElement} clickedButton - The button element that was clicked.
         */
        function handleFeatureClick(clickedButton) {
            const targetId = clickedButton.dataset.target; // e.g., "feature-1"
            const targetFeaturePanel = document.getElementById(targetId);
            const targetDescriptionPanel = document.getElementById(`desc-${targetId}`);

            if (!targetFeaturePanel || !targetDescriptionPanel) return;

            // --- 1. Update Button State & Slider ---
            featureButtons.forEach(btn => btn.classList.remove('is-active'));
            clickedButton.classList.add('is-active');
            moveFeatureSlider(clickedButton);

            // --- 2. Hide All Panels & Stop Videos ---
            featurePanels.forEach(panel => {
                panel.classList.remove('is-visible');
                // Find any video in the panel that is being hidden
                const video = panel.querySelector('video');
                if (video) {
                    video.pause();
                    video.currentTime = 0; // Reset video to start
                }
            });
            
            descriptionPanels.forEach(panel => {
                panel.classList.remove('is-visible');
            });

            // --- 3. Show Target Panels & Play Video ---
            targetFeaturePanel.classList.add('is-visible');
            
            // Check if the new active panel has a video and play it
            const activeVideo = targetFeaturePanel.querySelector('video');
            if (activeVideo) {
                // Use .catch() to handle potential browser autoplay restrictions
                activeVideo.play().catch(error => {
                    console.log("Video play was prevented:", error);
                });
            }
            
            targetDescriptionPanel.classList.add('is-visible');
        }

        // --- 4. Add Event Listeners for Feature Selector ---
        featureButtons.forEach(button => {
            button.addEventListener('click', () => {
                handleFeatureClick(button);
            });
        });

        // --- 5. Initial Setup for Feature Selector ---
        const initialFeatureButton = document.querySelector('.toggle-btn.is-active');
        if (initialFeatureButton) {
            // Set the slider to the correct starting position on page load
            moveFeatureSlider(initialFeatureButton);
            // Note: The first video is set to 'autoplay' in the HTML,
            // so we don't need to manually .play() it on load.
        }

    } else {
        // This is helpful for debugging if the script doesn't run
        console.log('Feature selector widget elements not found. Skipping setup.');
    }

    // --- Feature Selector Widget End ---

    // --- Code for Scroll Animation (CONTINUOUS PLAYBACK VERSION) ---
    // NO nested DOMContentLoaded here
    
    // --- 1. Get Elements ---
    const scrollContainer = document.querySelector(".scroll-animation-container");
    const scrollVideo = document.getElementById("scroll-video"); // Use correct ID

    // --- Safety Check ---
    if (scrollContainer && scrollVideo) { 
        console.log("Initializing Scroll Animation (Continuous Play)...");

        const videoContainer = scrollContainer.querySelector(".video-frame-container"); 
        const phoneFrame = scrollContainer.querySelector("#phone-frame"); 
        const heroText = scrollContainer.querySelector(".hero-text"); 

        if (videoContainer && phoneFrame && heroText) { // Check children exist
             let isTicking = false;
             let shouldBePlaying = false; 
             const triggerPoint = 0.1; // 10% trigger line

             function animateOnScroll() {
                 if (!scrollContainer || !scrollVideo) { 
                     isTicking = false;
                     return;
                 }
                 const containerTop = scrollContainer.offsetTop;
                 const containerHeight = scrollContainer.offsetHeight;
                 const scrollY = window.scrollY;
                 let progress = (scrollY - containerTop) / (containerHeight - window.innerHeight);
                 if (progress < 0) progress = 0;
                 if (progress > 1) progress = 1;

                 // Apply Visual Styles
                 const scale = 2 - (progress * 1); 
                 const frameOpacity = progress;
                 const heroOpacity = 1 - progress;
                 videoContainer.style.transform = `scale(${scale})`;
                 phoneFrame.style.opacity = frameOpacity;
                 heroText.style.opacity = heroOpacity;

                 // --- Handle Video Playback (Continuous Play Logic) ---
                 const isPastTrigger = progress > triggerPoint;

                 if (isPastTrigger && !shouldBePlaying) {
                     console.log("--- Scroll DOWN past trigger: PLAY ---");
                     scrollVideo.muted = true; 
                     scrollVideo.currentTime = 0; 
                     let playPromise = scrollVideo.play();
                      if (playPromise !== undefined) {
                         playPromise.catch(error => console.error("Scroll Autoplay failed:", error));
                     }
                     shouldBePlaying = true; 
                 } 
                 else if (!isPastTrigger && shouldBePlaying) {
                     console.log("--- Scroll UP past trigger: RESET ---");
                     scrollVideo.pause();
                     scrollVideo.currentTime = 0; 
                     shouldBePlaying = false; 
                 }
                 isTicking = false;
             }

             // Attach scroll listener
             window.addEventListener("scroll", () => {
                 if (!isTicking) {
                     window.requestAnimationFrame(animateOnScroll);
                     isTicking = true;
                 }
             });

             // Run once on load
             animateOnScroll();

             // Ensure video stops when it ends
             scrollVideo.addEventListener('ended', () => {
                  console.log("Scroll video ended.");
                  scrollVideo.pause(); 
                  shouldBePlaying = false; // Reset state
             });

        } else {
             console.error("Scroll Animation: Missing required child elements.")
        }
    } else {
         console.log("Scroll animation elements not found on this page."); 
    } // End Scroll Animation

    // --- Code for Carousel 1 (The second one with unique IDs) ---
    const track1 = document.getElementById('carouselTrack1'); // Use ID with '1'
    if (track1) {
        console.log("Initializing Carousel 1..."); // Log which carousel this is
        const nextButton1 = document.getElementById('carouselNextBtn1'); // Use ID with '1'
        const prevButton1 = document.getElementById('carouselPrevBtn1'); // Use ID with '1'
        
        // Check if buttons exist
        if (nextButton1 && prevButton1) {
            const slides1 = Array.from(track1.children); // Get slides for this track
            let currentIndex1 = 0; // Use unique index variable
            
            // This MUST match the 'margin-right' in your CSS
            const gap1 = 20; 

            // Function specific to this carousel
            function updateSliderPosition1() {
                 let newTransform = 0;
                 
                 // Loop through slides1 up to currentIndex1
                 for (let i = 0; i < currentIndex1; i++) {
                     if(slides1[i]) {
                        // Calculate offset based on actual slide width + gap
                        newTransform -= slides1[i].offsetWidth + gap1; 
                     }
                 }
                 
                 // Apply transform to track1
                 track1.style.transform = `translateX(${newTransform}px)`;
                 updateButtons1(); // Call specific update function
            }

            // Function specific to this carousel
            function updateButtons1() {
                 // Disable prev button if at the start
                 prevButton1.disabled = currentIndex1 === 0; 
                 
                 const wrapper1 = track1.parentElement;
                 if (!wrapper1) return; 
                 
                 const trackWidth1 = track1.scrollWidth;
                 const wrapperWidth1 = wrapper1.clientWidth;
                 
                 let currentTransform1 = 0;
                 if (track1.style.transform && track1.style.transform.includes('translateX')) {
                     currentTransform1 = Math.abs(parseFloat(track1.style.transform.split('(')[1]));
                 }
                 
                 // Check if the end of the track is visible
                 const visibleWidth1 = currentTransform1 + wrapperWidth1;
                 // Check if end is reached (with a small tolerance for rounding)
                 const atEnd1 = visibleWidth1 >= trackWidth1 - (gap1 / 2); 
                 
                 nextButton1.disabled = atEnd1; // Disable next button if at the end
            }

            // Event listeners specific to this carousel
            nextButton1.addEventListener('click', () => {
                if (slides1.length > 0 && currentIndex1 < slides1.length - 1) { 
                    currentIndex1++;
                    updateSliderPosition1();
                }
            });

            prevButton1.addEventListener('click', () => {
                if (currentIndex1 > 0) {
                    currentIndex1--;
                    updateSliderPosition1();
                }
            });

            // Recalculate on resize in case window size changes
            window.addEventListener('resize', updateSliderPosition1);
            
            // Initial setup for this carousel
            updateButtons1(); 
        } else {
             console.error("Carousel 1: Buttons not found (PrevBtn1 or NextBtn1).");
        }
    } // End Carousel 1

    // --- Code for Carousel 3 (iOS Features) ---
    const track3 = document.getElementById('carouselTrack3'); // Use ID with '3'
    if (track3) {
        console.log("Initializing Carousel 3..."); 
        const nextButton3 = document.getElementById('carouselNextBtn3'); // Use ID with '3'
        const prevButton3 = document.getElementById('carouselPrevBtn3'); // Use ID with '3'
        
        if (nextButton3 && prevButton3) {
            const slides3 = Array.from(track3.children); // Get slides for this track
            let currentIndex3 = 0; // Use unique index variable
            
            // This MUST match the 'margin-right' in your CSS
            const gap3 = 20; 

            // Function specific to this carousel
            function updateSliderPosition3() {
                 let newTransform = 0;
                 
                 // Loop through slides3 up to currentIndex3
                 for (let i = 0; i < currentIndex3; i++) {
                     if(slides3[i]) {
                        // Calculate offset based on actual slide width + gap
                        newTransform -= slides3[i].offsetWidth + gap3; 
                     }
                 }
                 
                 // Apply transform to track3
                 track3.style.transform = `translateX(${newTransform}px)`;
                 updateButtons3(); // Call specific update function
            }

            // Function specific to this carousel
            function updateButtons3() {
                 prevButton3.disabled = currentIndex3 === 0; // Use specific index and button
                 
                 const wrapper3 = track3.parentElement;
                 if (!wrapper3) return; 
                 
                 const trackWidth3 = track3.scrollWidth;
                 const wrapperWidth3 = wrapper3.clientWidth;
                 
                 let currentTransform3 = 0;
                 if (track3.style.transform && track3.style.transform.includes('translateX')) {
                     currentTransform3 = Math.abs(parseFloat(track3.style.transform.split('(')[1]));
                 }
                 
                 // Check if end is reached
                 const visibleWidth3 = currentTransform3 + wrapperWidth3;
                 // Check if end is reached (with a small tolerance for rounding)
                 const atEnd3 = visibleWidth3 >= trackWidth3 - (gap3 / 2); 
                 
                 nextButton3.disabled = atEnd3; // Use specific button
            }

            // Event listeners specific to this carousel
            nextButton3.addEventListener('click', () => {
                if (slides3.length > 0 && currentIndex3 < slides3.length - 1) { 
                    currentIndex3++;
                    updateSliderPosition3();
                }
            });

            prevButton3.addEventListener('click', () => {
                if (currentIndex3 > 0) {
                    currentIndex3--;
                    updateSliderPosition3();
                }
            });

            // Recalculate on resize
            window.addEventListener('resize', updateSliderPosition3);
            
            // Initial setup for this carousel
            updateButtons3(); 
        } else {
             console.error("Carousel 3: Buttons not found (PrevBtn3 or NextBtn3).");
        }
    } // End Carousel 3\

    // --- Code for Carousel 4 ---
    const track4 = document.getElementById('carouselTrack4'); // Use ID with '4'
    if (track4) {
        console.log("Initializing Carousel 4..."); 
        const nextButton4 = document.getElementById('carouselNextBtn4'); // Use ID with '4'
        const prevButton4 = document.getElementById('carouselPrevBtn4'); // Use ID with '4'
        
        if (nextButton4 && prevButton4) {
            const slides4 = Array.from(track4.children); // Get slides for this track
            let currentIndex4 = 0; // Use unique index variable
            
            // This MUST match the 'margin-right' in your CSS for .carousel-slide4
            const gap4 = 20; 

            // Function specific to this carousel
            function updateSliderPosition4() {
                 let newTransform = 0;
                 
                 // Loop through slides4 up to currentIndex4
                 for (let i = 0; i < currentIndex4; i++) {
                     if(slides4[i]) {
                        // Calculate offset based on actual slide width + gap
                        newTransform -= slides4[i].offsetWidth + gap4; 
                     }
                 }
                 
                 // Apply transform to track4
                 track4.style.transform = `translateX(${newTransform}px)`;
                 updateButtons4(); // Call specific update function
            }

            // Function specific to this carousel
            function updateButtons4() {
                 prevButton4.disabled = currentIndex4 === 0; // Use specific index and button
                 
                 const wrapper4 = track4.parentElement;
                 if (!wrapper4) return; 
                 
                 const trackWidth4 = track4.scrollWidth;
                 const wrapperWidth4 = wrapper4.clientWidth;
                 
                 let currentTransform4 = 0;
                 if (track4.style.transform && track4.style.transform.includes('translateX')) {
                     currentTransform4 = Math.abs(parseFloat(track4.style.transform.split('(')[1]));
                 }
                 
                 // Check if end is reached
                 const visibleWidth4 = currentTransform4 + wrapperWidth4;
                 const atEnd4 = visibleWidth4 >= trackWidth4 - (gap4 / 2); 
                 
                 nextButton4.disabled = atEnd4; // Use specific button
            }

            // Event listeners specific to this carousel
            nextButton4.addEventListener('click', () => {
                if (slides4.length > 0 && currentIndex4 < slides4.length - 1) { 
                    currentIndex4++;
                    updateSliderPosition4();
                }
            });

            prevButton4.addEventListener('click', () => {
                if (currentIndex4 > 0) {
                    currentIndex4--;
                    updateSliderPosition4();
                }
            });

            // Recalculate on resize
            window.addEventListener('resize', updateSliderPosition4);
            
            // Initial setup for this carousel
            updateButtons4(); 
        } else {
             console.error("Carousel 4: Buttons not found (PrevBtn4 or NextBtn4).");
        }
    } // End Carousel 4

    // --- Code for Carousel 5 ---
    const track5 = document.getElementById('carouselTrack5'); // Use ID with '5'
    if (track5) {
        console.log("Initializing Carousel 5..."); 
        const nextButton5 = document.getElementById('carouselNextBtn5'); // Use ID with '5'
        const prevButton5 = document.getElementById('carouselPrevBtn5'); // Use ID with '5'
        
        if (nextButton5 && prevButton5) {
            const slides5 = Array.from(track5.children); // Get slides for this track
            let currentIndex5 = 0; // Use unique index variable
            
            // This MUST match the 'margin-right' in your CSS for .carousel-slide5
            const gap5 = 20; 

            // Function specific to this carousel
            function updateSliderPosition5() {
                 let newTransform = 0;
                 
                 // Loop through slides5 up to currentIndex5
                 for (let i = 0; i < currentIndex5; i++) {
                     if(slides5[i]) {
                        // Calculate offset based on actual slide width + gap
                        newTransform -= slides5[i].offsetWidth + gap5; 
                     }
                 }
                 
                 // Apply transform to track5
                 track5.style.transform = `translateX(${newTransform}px)`;
                 updateButtons5(); // Call specific update function
            }

            // Function specific to this carousel
            function updateButtons5() {
                 prevButton5.disabled = currentIndex5 === 0; // Use specific index and button
                 
                 const wrapper5 = track5.parentElement;
                 if (!wrapper5) return; 
                 
                 const trackWidth5 = track5.scrollWidth;
                 const wrapperWidth5 = wrapper5.clientWidth;
                 
                 let currentTransform5 = 0;
                 if (track5.style.transform && track5.style.transform.includes('translateX')) {
                     currentTransform5 = Math.abs(parseFloat(track5.style.transform.split('(')[1]));
                 }
                 
                 // Check if end is reached
                 const visibleWidth5 = currentTransform5 + wrapperWidth5;
                 const atEnd5 = visibleWidth5 >= trackWidth5 - (gap5 / 2); 
                 
                 nextButton5.disabled = atEnd5; // Use specific button
            }

            // Event listeners specific to this carousel
            nextButton5.addEventListener('click', () => {
                if (slides5.length > 0 && currentIndex5 < slides5.length - 1) { 
                    currentIndex5++;
                    updateSliderPosition5();
                }
            });

            prevButton5.addEventListener('click', () => {
                if (currentIndex5 > 0) {
                    currentIndex5--;
                    updateSliderPosition5();
                }
            });

            // Recalculate on resize
            window.addEventListener('resize', updateSliderPosition5);
            
            // Initial setup for this carousel
            updateButtons5(); 
        } else {
             console.error("Carousel 5: Buttons not found (PrevBtn5 or NextBtn5).");
        }
    } // End Carousel 5

    //start of first carousel
    // Select elements for the *interactive* carousel
    const carousel = document.querySelector(".interactive-carousel");
    
    // Only run this code if the carousel exists on the page
    if (carousel) {
        console.log("Initializing Interactive (Side-Preview) Carousel...");
        
        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(track.children);
        const dotsContainer = carousel.querySelector(".pagination-dots");
        const playPauseBtn = carousel.querySelector(".play-pause-btn");
        const wrapper = carousel.querySelector(".carousel-wrapper"); // Get the wrapper

        // Safety check for essential elements
        if (!track || !dotsContainer || !playPauseBtn || !wrapper || slides.length === 0) {
            console.error("Carousel Error: Missing essential elements (track, dots, buttons, or wrapper).");
            return; // Stop this component's code
        }

        const playIcon = '<i class="fas fa-play"></i>';
        const pauseIcon = '<i class="fas fa-pause"></i>';
        const restartIcon = '<i class="fas fa-redo"></i>'; // NEW: Restart icon
        
        // This MUST match your CSS 'margin-right'
        const gap = 20; 
        
        let currentSlide = 0;
        let isPlaying = false; // Start paused by default
        let isAtEnd = false; 
        let slideTimer; 

        // --- 1. Create Pagination Dots ---
        slides.forEach((slide, index) => {
            const dot = document.createElement("button");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("is-active");
            
            dot.addEventListener("click", () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = carousel.querySelectorAll(".dot");

        // --- 2. Core Functions ---

        /**
         * Jumps to a specific slide by index
         */
        function goToSlide(slideIndex) {
            if (!slides[slideIndex]) return; 

            // Clear any running timers
            clearTimeout(slideTimer);
            
            // Stop the current video (if any)
            if (slides[currentSlide]) { 
                const currentVideo = slides[currentSlide].querySelector("video");
                if (currentVideo) {
                    currentVideo.pause();
                    currentVideo.currentTime = 0;
                }
            }
            
            // --- NEW CENTERING SLIDE LOGIC ---
            const wrapperWidth = wrapper.getBoundingClientRect().width;
            const currentSlideEl = slides[slideIndex];
            const slideWidth = currentSlideEl.getBoundingClientRect().width;
            
            let offsetBefore = 0;
            for (let i = 0; i < slideIndex; i++) {
                offsetBefore += slides[i].offsetWidth + gap;
            }

            const centerPoint = wrapperWidth / 2;
            const slideCenter = slideWidth / 2;
            
            const newTransform = -(offsetBefore - centerPoint + slideCenter);
            
            track.style.transform = `translateX(${newTransform}px)`;
            // --- END NEW SLIDE LOGIC ---

            // Deactivate old dot
            if (dots[currentSlide]) {
                dots[currentSlide].classList.remove("is-active");
            }

            // Activate new slide and dot
            currentSlide = slideIndex;
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add("is-active");
            }

            // MODIFIED: Reset 'isAtEnd' state and button icon
            isAtEnd = false;
            if (isPlaying) {
                playPauseBtn.innerHTML = pauseIcon;
                playPauseBtn.setAttribute("aria-label", "Pause slideshow");
                playCurrentSlide(); // Autoplay if we're moving
            } else {
                playPauseBtn.innerHTML = playIcon;
                playPauseBtn.setAttribute("aria-label", "Play slideshow");
            }
        }

        /**
         * Logic to play the currently active slide
         */
        function playCurrentSlide() {
            const slide = slides[currentSlide];
            if (!slide || !isPlaying) return; // Don't play if paused

            const slideType = slide.dataset.type;

            if (slideType === "video") {
                const video = slide.querySelector("video");
                if (video) {
                    video.currentTime = 0;
                    let playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => console.error("Video play failed:", error));
                    }
                    
                    video.onended = () => {
                        // Wait 3 seconds after video ends
                        slideTimer = setTimeout(() => {
                            if (currentSlide === slides.length - 1) {
                                // LAST SLIDE: Stop and show restart
                                isPlaying = false;
                                isAtEnd = true;
                                playPauseBtn.innerHTML = restartIcon;
                                playPauseBtn.setAttribute("aria-label", "Restart slideshow");
                            } else {
                                nextSlide();
                            }
                        }, 2000); 
                    };
                }
            } else if (slideType === "image") {
                const duration = parseInt(slide.dataset.duration, 10) || 3000;
                
                slideTimer = setTimeout(() => {
                    if (currentSlide === slides.length - 1) {
                        // LAST SLIDE: Stop and show restart
                        isPlaying = false;
                        isAtEnd = true;
                        playPauseBtn.innerHTML = restartIcon;
                        playPauseBtn.setAttribute("aria-label", "Restart slideshow");
                    } else {
                        nextSlide();
                    }
                }, duration);
            }
        }

        /**
         * Moves to the next slide (DOES NOT WRAP)
         */
        function nextSlide() {
            let nextSlideIndex = currentSlide + 1;
            // Only go to the next slide if it exists
            if (nextSlideIndex < slides.length) {
                goToSlide(nextSlideIndex);
            }
        }

        /**
         * Toggles the play/pause/restart state
         */
        function togglePlayPause() {
            if (isAtEnd) {
                // --- RESTART ---
                isAtEnd = false;
                isPlaying = true;
                playPauseBtn.innerHTML = pauseIcon;
                playPauseBtn.setAttribute("aria-label", "Pause slideshow");
                goToSlide(0); // Go to the first slide

            } else if (isPlaying) {
                // --- PAUSE ---
                isPlaying = false;
                playPauseBtn.innerHTML = playIcon;
                playPauseBtn.setAttribute("aria-label", "Play slideshow");
                
                clearTimeout(slideTimer); // Stop image timers
                const currentVideo = slides[currentSlide]?.querySelector("video");
                if (currentVideo) {
                    currentVideo.pause(); // Pause video
                }

            } else {
                // --- PLAY ---
                isPlaying = true;
                playPauseBtn.innerHTML = pauseIcon;
                playPauseBtn.setAttribute("aria-label", "Pause slideshow");
                
                // Resume playback
                playCurrentSlide(); 
            }
        }

        // --- 3. Attach Event Listeners ---
        playPauseBtn.addEventListener("click", togglePlayPause);
        
        // Recalculate on resize
        window.addEventListener('resize', () => goToSlide(currentSlide));

        // --- 4. Start the Carousel ---
        setTimeout(() => {
            goToSlide(0); // This just sets the first slide
        }, 100); 
        
        // --- 5. Use Intersection Observer to play when visible ---
        const carouselObserverOptions = {
            root: null, // watch the viewport
            threshold: 0.5 // Trigger when 50% of the carousel is visible
        };

        const carouselObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                // When the carousel is on screen
                if (entry.isIntersecting) {
                    // If it's not already playing (and not at the end)
                    if (!isPlaying && !isAtEnd) {
                        // "Click" the play button to start
                        togglePlayPause(); 
                    }
                    // Stop watching, we only want this to run once
                    observer.unobserve(carousel);
                }
            });
        };

        // Create and start the observer
        const carouselObserver = new IntersectionObserver(carouselObserverCallback, carouselObserverOptions);
        carouselObserver.observe(carousel);
        
    } // End if(carousel)


    //start of dialog box selector
    // Use the ID selector
    const featureContainer = document.querySelector('#spec-feature-component');
    
    if (featureContainer) {
        // --- SELECTORS ---
        const featureItems = featureContainer.querySelectorAll('.feature-item');
        const featureBtns = featureContainer.querySelectorAll('.feature-btn');
        const featureContents = featureContainer.querySelectorAll('.feature-content');
        
        const prevBtn = featureContainer.querySelector('#feature-prev');
        const nextBtn = featureContainer.querySelector('#feature-next');
        const resetBtn = featureContainer.querySelector('.feature-reset-btn');
        const defaultContent = featureContainer.querySelector('#content-default');
        
        let currentIndex = -1; // -1 = default state

        // --- NEW: Function to reset to default ---
        function resetToDefault() {
            // Deactivate all accordion items
            featureItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Deactivate all visual content
            featureContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Activate the default visual content
            if (defaultContent) {
                defaultContent.classList.add('active');
            }
            
            // Hide arrows
            featureContainer.classList.remove('state-active');
            currentIndex = -1;
        }

        // --- UPDATED: Main function to show a feature ---
        function showFeature(targetId, buttonToActivate) {
            
            const parentItem = buttonToActivate.closest('.feature-item');
            const isAlreadyActive = parentItem.classList.contains('active');

            // --- 1. Handle Accordion (Left Column) ---
            
            // First, collapse all other items
            featureItems.forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('active');
                }
            });

            // --- 2. Handle Visual (Right Column) ---
            
            // Hide all visuals
            featureContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // --- 3. Toggle Logic ---
            
            if (isAlreadyActive) {
                // User clicked an active item. Collapse it and show default.
                parentItem.classList.remove('active');
                if (defaultContent) {
                    defaultContent.classList.add('active');
                }
                featureContainer.classList.remove('state-active'); // Hide arrows
                currentIndex = -1;
                
            } else {
                // User clicked an inactive item. Open it.
                parentItem.classList.add('active');
                
                // Show the target visual
                const targetContent = featureContainer.querySelector(`#${targetId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Show arrows
                featureContainer.classList.add('state-active');
                
                // Update the current index
                currentIndex = Array.from(featureBtns).indexOf(buttonToActivate);
            }
        }

        // --- 1. Event Listeners for Feature Buttons ---
        featureBtns.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.target;
                showFeature(targetId, button);
            });
        });
        
        // --- 2. Event Listener for Reset Button ---
        if (resetBtn) {
            resetBtn.addEventListener('click', resetToDefault);
        }

        // --- 3. Event Listeners for Arrow Buttons ---
        prevBtn.addEventListener('click', () => {
            let prevIndex;
            if (currentIndex <= 0) { // Also handles -1
                prevIndex = featureBtns.length - 1;
            } else {
                prevIndex = currentIndex - 1;
            }
            featureBtns[prevIndex].click(); // Simulate a click
        });

        nextBtn.addEventListener('click', () => {
            let nextIndex;
            if (currentIndex === -1 || currentIndex === featureBtns.length - 1) {
                nextIndex = 0;
            } else {
                nextIndex = currentIndex + 1;
            }
            featureBtns[nextIndex].click(); // Simulate a click
        });

        // --- 4. Event Listeners for "Colors" Swatches ---
        const colorSwatches = featureContainer.querySelectorAll('.color-swatch');
        const colorDisplayImage = featureContainer.querySelector('#color-display-image');
        const colorNameText = featureContainer.querySelector('#color-name');

        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop click from bubbling up to the feature-btn
                
                colorSwatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                
                const newImg = swatch.dataset.img;
                const newText = swatch.dataset.text;

                if (colorDisplayImage) {
                    colorDisplayImage.src = newImg;
                }
                if (colorNameText) {
                    colorNameText.textContent = newText;
                }
            });
        });
        
        // Start in default state
        resetToDefault();
    }
});