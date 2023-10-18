const chatbotConversation = document.getElementById('chatbot-conversation');
let conversationStr = '';

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userInput = document.getElementById('user-input');
    conversationStr += `${userInput.value} -> `;
    addHumanSpeechBubble(userInput.value);
    userInput.value = '';
    fetchReply();
});

async function fetchReply() {
    const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({ conversation: conversationStr }),
    });

    if (response.status === 200) {
        const responseData = await response.json();
        const replyText = responseData.response.data.choices[0].text;
        conversationStr += `${replyText} \n`;
        renderTypewriterText(replyText);
    } else {
        console.error('Error calling OpenAI API');
    }
}

function addHumanSpeechBubble(text) {
    const newSpeechBubble = document.createElement('div');
    newSpeechBubble.classList.add('speech', 'speech-human');
    chatbotConversation.appendChild(newSpeechBubble);
    newSpeechBubble.textContent = text;
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}

function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div');
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor');
    chatbotConversation.appendChild(newSpeechBubble);
    let i = 0;
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text[i];
        if (i === text.length - 1) {
            clearInterval(interval);
            newSpeechBubble.classList.remove('blinking-cursor');
        }
        i++;
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    }, 50);
}
