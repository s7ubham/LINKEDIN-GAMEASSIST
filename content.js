// Game assist instance tracker
let currentGameAssistInstance = null;
const loadedGameScripts = new Set(); // Track which game scripts have been loaded

// Function to load HTML from background script
async function loadHTML(filename) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'loadHTML', filename: filename }, response => {
      if (response && response.success) {
        resolve(response.content);
      } else {
        reject(new Error(`Failed to load ${filename}`));
      }
    });
  });
}

// Function to load game assist script dynamically by injecting into page
async function loadGameScript(gameName) {
  // Check if script is already loaded
  if (loadedGameScripts.has(gameName)) {
    console.log(`✅ Game script already loaded: ${gameName}.js`);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    // Inject a script tag with src into the page (not content script)
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(`games/${gameName}.js`);
    
    script.onload = () => {
      loadedGameScripts.add(gameName);
      console.log(`✅ Game script loaded: ${gameName}.js`);
      script.remove(); // Remove the script tag after loading
      resolve();
    };
    
    script.onerror = () => {
      console.error(`❌ Failed to load game script: ${gameName}.js`);
      reject(new Error(`Failed to load ${gameName}.js`));
    };
    
    // Inject into document.documentElement (page context)
    (document.head || document.documentElement).appendChild(script);
  });
}

// Function to detect current game from URL
function detectCurrentGame() {
  const pathname = window.location.pathname;
  // Extract game name from URL like /games/zip/, /games/mini-sudoku/, etc.
  const gameMatch = pathname.match(/\/games\/([a-z\-]+)\/?$/);
  if (gameMatch && gameMatch[1]) {
    return gameMatch[1]; // Returns: zip, mini-sudoku, tango, queens, pinpoint, crossclimb
  }
  return null;
}

// Function to get game assist instance from global scope
function getGameAssistInstance(gameName) {
  // Convert game name to camelCase class name
  const className = gameName
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('') + 'GameAssist';

  // Map specific cases
  const classNameMap = {
    'zip': 'ZipGameAssist',
    'mini-sudoku': 'MiniSudokuGameAssist',
    'tango': 'TangoGameAssist',
    'queens': 'QueensGameAssist',
    'pinpoint': 'PinpointGameAssist',
    'crossclimb': 'CrossClimbGameAssist'
  };

  const actualClassName = classNameMap[gameName];
  return window[actualClassName] ? new window[actualClassName]() : null;
}

// Function to create confetti effect
function createConfetti() {
  const confettiPieces = 50;
  
  for (let i = 0; i < confettiPieces; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)];
    confetti.style.borderRadius = '50%';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.zIndex = 10001;
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);
    
    const duration = 3 + Math.random() * 2;
    const xOffset = (Math.random() - 0.5) * 400;
    
    confetti.animate([
      { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${window.innerHeight + 100}px) translateX(${xOffset}px) rotate(360deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    setTimeout(() => confetti.remove(), duration * 1000);
  }
}

// Always show the checkbox on any LinkedIn page
if (window.location.href.includes('linkedin.com/games')) {
  // Games page - show checkbox with toggle
  const assistModeEnabled = localStorage.getItem('linkedinAssistMode');
  const currentGame = detectCurrentGame();
  
  console.log('Games page detected. Assist mode enabled:', assistModeEnabled);
  console.log('Current game:', currentGame);
  
  loadHTML('checkbox-games.html').then(htmlContent => {
    console.log('Games checkbox HTML loaded:', htmlContent.length > 0);
    const checkboxContainer = document.createElement('div');
    checkboxContainer.id = 'linkedin-detector-checkbox';
    checkboxContainer.innerHTML = htmlContent;
    
    document.body.appendChild(checkboxContainer);
    console.log('Games checkbox container added to DOM');
    
    // Use a slight delay to ensure elements are rendered
    setTimeout(() => {
      const toggle = document.getElementById('assist-toggle');
      const slider = document.getElementById('toggle-slider');
      const knob = document.getElementById('toggle-knob');
      
      console.log('Toggle elements found:', { toggle: !!toggle, slider: !!slider, knob: !!knob });
      
      if (!toggle) {
        console.error('Toggle element not found!');
        return;
      }
      
      // Default toggle to OFF unless explicitly set to ON in localStorage
      const isEnabled = assistModeEnabled === 'true';
      toggle.checked = isEnabled;
      slider.style.backgroundColor = isEnabled ? '#00C853' : '#ccc';
      knob.style.left = isEnabled ? '26px' : '2px';
      
      console.log('Toggle initialized:', { checked: toggle.checked, enabled: isEnabled });
      
      // If already enabled on page load, initialize assist
      if (isEnabled && currentGame === 'tango') {
        console.log('Auto-initializing tango assist on page load...');
        loadGameScript('tango').then(() => {
          setTimeout(() => {
            console.log('Sending message to page: tangoHighlightBoard');
            window.postMessage({ type: 'TANGO_HIGHLIGHT_BOARD' }, '*');
          }, 500);
        }).catch(error => {
          console.error('Error loading tango assist:', error);
        });
      }
      
      // Handle toggle switch
      toggle.addEventListener('change', function() {
        console.log('Toggle switched:', this.checked);
        if (this.checked) {
          localStorage.setItem('linkedinAssistMode', 'true');
          slider.style.backgroundColor = '#00C853';
          knob.style.left = '26px';
          createConfetti();
          console.log('LinkedIn Assist Mode: Enabled');
          
          if (currentGame === 'tango') {
            loadGameScript('tango').then(() => {
              setTimeout(() => {
                console.log('Sending message to page: tangoHighlightBoard on toggle');
                window.postMessage({ type: 'TANGO_HIGHLIGHT_BOARD' }, '*');
              }, 500);
            });
          }
        } else {
          localStorage.setItem('linkedinAssistMode', 'disabled');
          slider.style.backgroundColor = '#ccc';
          knob.style.left = '2px';
          console.log('LinkedIn Assist Mode: Disabled');
          
          if (currentGame === 'tango') {
            console.log('Sending message to page: tangoRemoveHighlight');
            window.postMessage({ type: 'TANGO_REMOVE_HIGHLIGHT' }, '*');
          }
        }
      });
    }, 100);
  }).catch(error => {
    console.error('Failed to load checkbox-games.html:', error);
  });
} else {
  // Non-games page - show simple checkbox
  loadHTML('checkbox.html').then(htmlContent => {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.id = 'linkedin-detector-checkbox';
    checkboxContainer.innerHTML = htmlContent;
    document.body.appendChild(checkboxContainer);
    console.log('LinkedIn Detector: Active on LinkedIn');
  });
}

/**
 * Initialize game assist for the current game
 * Loads the game-specific script and initializes the assist
 * @param {string} gameName - The name of the game (e.g., 'zip', 'mini-sudoku')
 */
async function initializeGameAssist(gameName) {
  try {
    console.log(`🎮 Loading assist for game: ${gameName}`);
    
    // Load the game script (or use already loaded one)
    await loadGameScript(gameName);
    
    // Give the script a moment to execute and register the class
    const delay = loadedGameScripts.has(gameName) ? 10 : 100;
    setTimeout(() => {
      // Get the game assist instance
      const gameAssist = getGameAssistInstance(gameName);
      
      if (gameAssist) {
        currentGameAssistInstance = gameAssist;
        gameAssist.initialize();
        console.log(`✅ ${gameName} Game Assist initialized successfully`);
      } else {
        console.error(`❌ Failed to instantiate ${gameName} Game Assist`);
      }
    }, delay);
  } catch (error) {
    console.error(`❌ Error initializing ${gameName} Game Assist:`, error);
  }
}
