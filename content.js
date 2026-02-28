// Create and inject the green checkbox into the page
const checkboxContainer = document.createElement('div');
checkboxContainer.id = 'linkedin-detector-checkbox';
checkboxContainer.innerHTML = `
  <div style="
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border: 2px solid #00C853;
    border-radius: 8px;
    padding: 15px 20px;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    text-align: center;
  ">
    <div style="font-size: 32px; margin-bottom: 8px;">☑️</div>
    <div style="
      font-size: 12px;
      color: #0A66C2;
      font-weight: bold;
    ">You're on LinkedIn!</div>
  </div>
`;

document.body.appendChild(checkboxContainer);

console.log('LinkedIn Detector: Active on LinkedIn');
