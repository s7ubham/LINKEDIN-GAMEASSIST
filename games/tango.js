
/**
 * Tango Game Assist - Simple Functions
 */

console.log('✅ Tango.js script is loading...');

// Parse board and highlight
function tangoHighlightBoard() {
  try {
    console.log('🎮 Tango Game Assist activated');
    
    // Wait for board to be ready (up to 3 seconds)
    let attempts = 0;
    const maxAttempts = 30; // 30 * 100ms = 3 seconds
    
    const boardCheckInterval = setInterval(() => {
      attempts++;
      const grid = document.querySelectorAll(".lotka-grid")[0];
      
      if (grid || attempts >= maxAttempts) {
        clearInterval(boardCheckInterval);
        
        if (!grid) {
          console.warn('Tango board grid not found after waiting');
          return;
        }
        
        // Simulate a click on board
        const cells = document.querySelectorAll(".lotka-cell-content");
        console.log("Found SVG cells:", cells.length);

        if (cells.length > 0) {
          const svg = cells[24];
          ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(eventType => {
            svg.dispatchEvent(new MouseEvent(eventType, {
              bubbles: true,
              cancelable: true,
              view: window
            }));
          });
        }

        // Parse board state
        const lotkaCellArray = [];
        const gridArray = Array.from(grid.children);
        let i = 0;

        gridArray.forEach(g => {
          if (g.className.includes("lotka-cell--locked")) {
            console.log('Locked cell at index:', i);
            lotkaCellArray.push(g.querySelector("[aria-label]").getAttribute("aria-label"));
            i++;
          } else if (g.querySelector(".lotka-cell")) {
            if (g.querySelector(".lotka-cell-edge")) {
              const edgeLabel = g.querySelector(".lotka-cell-edge").querySelector("[aria-label]").getAttribute("aria-label");
              lotkaCellArray.push("Empty " + edgeLabel);
              console.log('Empty cell with edge at index:', i);
              i++;
            } else {
              lotkaCellArray.push("Empty");
              console.log('Empty cell at index:', i);
              i++;
            }
          }
        });

        // Console log the complete board state
        console.log('========================================');
        console.log('🎮 TANGO BOARD STATE');
        console.log('========================================');
        console.table(lotkaCellArray);
        console.log('Board Array:', lotkaCellArray);
        console.log('Board Length:', lotkaCellArray.length);
        console.log('========================================');

        // Highlight the board border
        grid.style.border = '3px solid #FF6B6B';
        grid.style.boxShadow = '0 0 10px #FF6B6B';
        grid.style.borderRadius = '4px';
        
        console.log('✨ Tango board border highlighted');
      }
    }, 100);
  } catch (error) {
    console.error('Error in tangoHighlightBoard:', error);
  }
}

// Remove highlight
function tangoRemoveHighlight() {
  try {
    console.log('🎮 Tango Game Assist deactivated');
    const grid = document.querySelectorAll(".lotka-grid")[0];
    if (grid) {
      grid.style.border = '';
      grid.style.boxShadow = '';
      grid.style.borderRadius = '';
    }
  } catch (error) {
    console.error('Error in tangoRemoveHighlight:', error);
  }
}

// Listen for messages from content script
window.addEventListener('message', (event) => {
  if (event.source !== window) return; // Only accept messages from this window
  
  if (event.data.type === 'TANGO_HIGHLIGHT_BOARD') {
    console.log('Page received message: TANGO_HIGHLIGHT_BOARD');
    tangoHighlightBoard();
  } else if (event.data.type === 'TANGO_REMOVE_HIGHLIGHT') {
    console.log('Page received message: TANGO_REMOVE_HIGHLIGHT');
    tangoRemoveHighlight();
  }
});

console.log('✅ Tango.js loaded');
