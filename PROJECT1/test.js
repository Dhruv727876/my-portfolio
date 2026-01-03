document.addEventListener("DOMContentLoaded", () => {
    
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