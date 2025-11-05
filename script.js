// Letter and number positions on the board (in pixels at 10760x6800 board size)
const BOARD_POSITIONS = {
    // Top row letters
    'A': { x: 1385, y: 3220 },
    'B': { x: 2035, y: 2908 },
    'C': { x: 2696, y: 2734 },
    'D': { x: 3358, y: 2634 },
    'E': { x: 4057, y: 2521 },
    'F': { x: 4731, y: 2459 },
    'G': { x: 5380, y: 2434 },
    'H': { x: 6129, y: 2471 },
    'I': { x: 6790, y: 2534 },
    'J': { x: 7277, y: 2596 },
    'K': { x: 7863, y: 2721 },
    'L': { x: 8513, y: 2896 },
    'M': { x: 9311, y: 3158 },

    // Bottom row letters
    'N': { x: 1161, y: 4306 },
    'O': { x: 1860, y: 4106 },
    'P': { x: 2496, y: 3907 },
    'Q': { x: 3208, y: 3782 },
    'R': { x: 3919, y: 3632 },
    'S': { x: 4581, y: 3620 },
    'T': { x: 5255, y: 3532 },
    'U': { x: 5979, y: 3582 },
    'V': { x: 6715, y: 3620 },
    'W': { x: 7526, y: 3769 },
    'X': { x: 8325, y: 3907 },
    'Y': { x: 8987, y: 4144 },
    'Z': { x: 9623, y: 4369 },

    // Numbers
    '1': { x: 2971, y: 4768 },
    '2': { x: 3470, y: 4768 },
    '3': { x: 3994, y: 4768 },
    '4': { x: 4543, y: 4768 },
    '5': { x: 5068, y: 4768 },
    '6': { x: 5604, y: 4768 },
    '7': { x: 6129, y: 4768 },
    '8': { x: 6640, y: 4768 },
    '9': { x: 7177, y: 4768 },
    '0': { x: 7714, y: 4768 },

    // Special positions
    'YES': { x: 2184, y: 1273 },
    'NO': { x: 8862, y: 1248 },
    'GOODBYE': { x: 5430, y: 5517 },
    ' ': { x: 5340, y: 3360 } // Space - center of board
};

// API configuration - loaded from config.js
const API_KEY = CONFIG.OPENAI_API_KEY;

// Message history - stores last 20 messages
let messageHistory = [];
const MAX_HISTORY = 20;

// DOM elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const statusDiv = document.getElementById('status');
const planchette = document.getElementById('planchette');

// Handle Enter key in message input
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        sendMessage();
    }
});

// Send message button
sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) {
        showStatus('Please enter a question...', 'error');
        return;
    }

    if (!API_KEY) {
        showStatus('Please enter your OpenAI API key first!', 'error');
        return;
    }

    // Disable input while processing
    messageInput.disabled = true;
    sendBtn.disabled = true;
    showStatus('The spirits are gathering...', 'thinking');

    try {
        // Build messages array with system prompt and history
        const messages = [
            {
                role: 'system',
                content: `You are someone who died and is communicating through a Ouija board. You should come up with a character and story and stick to it. Keep your responses SHORT (10-30 characters max). Use capital letters only. Do not be generic sounding (i.e. giving responses like "beyond the shadows"). Answer with only "YES" or "NO" if asked a question where this makes sense. Answer with "GOODBYE" if extremely angered. Never break character. Do not use punctuation except spaces and only use spaces after words DO NOT space out individual letters.`
            },
            ...messageHistory, // Include conversation history
            {
                role: 'user',
                content: message
            }
        ];

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 50,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        const spiritMessage = data.choices[0].message.content.trim().toUpperCase();

        // Add user message and assistant response to history
        messageHistory.push({
            role: 'user',
            content: message
        });
        messageHistory.push({
            role: 'assistant',
            content: spiritMessage
        });

        // Keep only last 20 messages (10 exchanges)
        if (messageHistory.length > MAX_HISTORY) {
            messageHistory = messageHistory.slice(-MAX_HISTORY);
        }

        // Animate the planchette to spell out the message
        await spellOutMessage(spiritMessage);

        // Return to center
        await movePlanchetteTo(5340, 3360);

        showStatus('The spirits have spoken...');

    } catch (error) {
        console.error('Error:', error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        // Re-enable input
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.value = '';
        messageInput.focus();
    }
}

async function spellOutMessage(message) {
    showStatus(`The spirits say: "${message}"`);

    // Check if the entire message is YES, NO, or GOODBYE
    if (message === 'YES' || message === 'NO' || message === 'GOODBYE') {
        const position = BOARD_POSITIONS[message];
        await movePlanchetteTo(position.x, position.y);
        await sleep(1500); // Pause longer on special words

        // If GOODBYE, close the page after a moment
        if (message === 'GOODBYE') {
            await sleep(1000);
            window.close();
            // If window.close() doesn't work, fade out the page
            document.body.style.transition = 'opacity 2s';
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:3em;color:#8b0000;font-family:serif;">The spirits have departed...</div>';
                document.body.style.opacity = '1';
            }, 2000);
        }

        return;
    }

    // Otherwise, spell out letter by letter
    for (let char of message) {
        // Get position for this character
        const position = BOARD_POSITIONS[char];

        if (position) {
            await movePlanchetteTo(position.x, position.y);
            // Pause on each letter
            await sleep(500);
        } else if (char === ' ') {
            // Brief pause for spaces
            await sleep(200);
        }
    }

    await sleep(500);
}

function movePlanchetteTo(x, y) {
    return new Promise((resolve) => {
        planchette.classList.add('moving');

        // Use pixel positioning
        planchette.style.left = `${x}px`;
        planchette.style.top = `${y}px`;

        // Wait for transition to complete
        setTimeout(() => {
            planchette.classList.remove('moving');
            resolve();
        }, 800);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showStatus(message, className = '') {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + className;
}

// Calculate and apply scale to board wrapper
function updateBoardScale() {
    const boardWrapper = document.getElementById('boardWrapper');

    // Get available width (with minimal padding)
    const availableWidth = window.innerWidth - 20;
    const availableHeight = window.innerHeight - 200; // Minimal space for controls

    // Calculate scale based on available space
    const scaleX = availableWidth / 10800;
    const scaleY = availableHeight / 6840;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1

    // Apply transform
    boardWrapper.style.transform = `scale(${scale})`;

    // Adjust wrapper height to match scaled content (eliminates blank space)
    const scaledHeight = 6840 * scale;
    boardWrapper.style.height = `${scaledHeight}px`;
    boardWrapper.style.maxHeight = `${scaledHeight}px`;
}

// Initialize planchette position
function initializePlanchette() {
    planchette.style.left = '5340px';
    planchette.style.top = '3360px';
}

// Update scale on window resize
window.addEventListener('resize', updateBoardScale);

// Initialize when page loads
window.addEventListener('load', () => {
    updateBoardScale();
    initializePlanchette();
});

// Initial status
showStatus('Ask the spirits a question...');
