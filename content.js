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
  console.log('Games page detected. Assist mode enabled:', assistModeEnabled);
  
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
      
      // Set initial state based on localStorage
      if (assistModeEnabled === 'true') {
        toggle.checked = true;
        slider.style.backgroundColor = '#00C853';
        knob.style.left = '26px';
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
        } else {
          localStorage.setItem('linkedinAssistMode', 'disabled');
          slider.style.backgroundColor = '#ccc';
          knob.style.left = '2px';
          console.log('LinkedIn Assist Mode: Disabled');
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
