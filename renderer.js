const { ipcRenderer } = require('electron');

// Get UI elements
const runCodeButton = document.getElementById('runCode');
const pythonCodeTextarea = document.getElementById('pythonCode');
const arduinoPortSelect = document.getElementById('arduinoPort');
const serialMonitor = document.getElementById('serialMonitor');

// Function to add messages to the serial monitor
function appendToSerialMonitor(message) {
  const newMessage = document.createElement('div');
  newMessage.textContent = message;
  serialMonitor.appendChild(newMessage);
  serialMonitor.scrollTop = serialMonitor.scrollHeight; // Auto-scroll to the latest message
}

// Add event listener to the "Run Python Code" button
runCodeButton.addEventListener('click', () => {
  const pythonCode = pythonCodeTextarea.value; // Get Python code from textarea
  const selectedPort = arduinoPortSelect.value; // Get the selected Arduino port

  // Basic validation
  if (!pythonCode.trim()) {
    alert('Please write some Python code before running!');
    return;
  }

  if (!selectedPort) {
    alert('Please select an Arduino port!');
    return;
  }

  // Display a loading message in the serial monitor
  appendToSerialMonitor('Executing Python script...\n');

  // Send the Python code and port to the main process
  ipcRenderer.invoke('run-python-code', { pythonCode, selectedPort })
    .then((output) => {
      // Display the output in the serial monitor
      appendToSerialMonitor('Execution finished.\n');
      appendToSerialMonitor(output);

      // Show a success notification
      alert('Python code executed successfully!');
    })
    .catch((error) => {
      // Display errors in the serial monitor
      appendToSerialMonitor('Error during execution:\n');
      appendToSerialMonitor(error.message);

      // Show an error notification
      alert('An error occurred while executing the Python code.');
    });
});
