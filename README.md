# Talking Board

An interactive AI-powered Ouija board that lets you communicate with spirits. This web application uses OpenAI's GPT-4 to generate responses from a persistent spirit character that maintains conversation context throughout your session.

## Features

- **AI Spirit Character**: Each session creates a unique spirit with its own backstory that stays consistent throughout the conversation
- **Animated Planchette**: Watch as the planchette glides across the board to spell out messages letter by letter
- **Conversation Memory**: Maintains conversation history (last 20 messages) for contextual responses
- **Special Responses**: The spirit can respond with YES, NO, or GOODBYE for appropriate questions

## Demo

The planchette moves smoothly across the board to spell out responses character by character. Special words like YES, NO, and GOODBYE move directly to their designated positions on the board. If the spirit says GOODBYE, the session ends dramatically.

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/talking-board.git
   cd talking-board
   ```

2. Set up your API key:
   ```bash
   cp config.example.js config.js
   ```

3. Open `config.js` and replace `'your-api-key-here'` with your actual OpenAI API key:
   ```javascript
   const CONFIG = {
       OPENAI_API_KEY: 'sk-your-actual-api-key-here'
   };
   ```

4. Open `index.html` in your web browser


## Usage

1. Open the application in your browser
2. Type your question in the input field
3. Click "Contact Spirits" or press Enter
4. Watch as the planchette moves across the board to spell out the spirit's response
5. Continue your conversation. The spirit will remember previous exchanges

## How It Works

### Spirit Character
The AI is prompted to create and maintain a unique character that is communicating through the Ouija board. Each spirit has its own personality and backstory that persists throughout the conversation.

### Response Generation
- Responses are limited to 10-30 characters to maintain authenticity
- The AI maintains conversation context using message history
- All responses are converted to uppercase letters
- For yes/no questions, the spirit typically responds with just YES or NO
- Extremely provocative questions may result in GOODBYE, ending the session

### Animation
- Each character position on the board is precisely mapped
- The planchette smoothly transitions between letters using CSS transforms
- Movement speed and pauses are calibrated for dramatic effect
- The planchette returns to the center of the board after each message

## Project Structure

```
talking-board/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Core application logic
├── config.example.js   # API key configuration template
├── config.js           # Your API key
├── Board.png           # Ouija board image
└── planchette.png      # Planchette image
```

## Technologies Used

- **HTML5/CSS3**: Structure and styling
- **Vanilla JavaScript**: Application logic
- **OpenAI GPT-4 Mini API**: AI-powered spirit responses
- **CSS Transforms**: Smooth planchette animations

## Configuration

The application uses the `gpt-4o-mini` model with the following parameters:
- `max_tokens`: 50
- `temperature`: 0.8 (for creative but controlled responses)

You can modify these in [script.js](script.js#L114-L119) if you want different response characteristics.

## Security Notes

- Never commit your `config.js` file with your actual API key
- Consider implementing rate limiting for production use
- OpenAI API usage will incur costs based on your usage
- The API key is exposed in client-side code. For production, implement a backend proxy

## License

MIT License - feel free to use this project however you'd like!

---
