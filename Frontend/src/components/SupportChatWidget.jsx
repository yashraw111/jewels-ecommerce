import React, { useState } from 'react';

// Component ke liye CSS styles
const styles = `
  .support-chat-widget-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
  .support-chat-button {
    background-color: #6633ff;
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    transition: transform 0.2s ease;
  }
  .support-chat-button:hover {
    transform: scale(1.1);
  }
  .support-chat-window {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 350px;
    max-height: 500px;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    transform-origin: bottom right;
  }
  .chat-header {
    background-color: #6633ff;
    color: white;
    padding: 15px;
    font-size: 1.2em;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .chat-body {
    padding: 20px;
    overflow-y: auto;
    flex-grow: 1;
  }
  .chat-message {
    margin-bottom: 15px;
    padding: 10px 15px;
    border-radius: 10px;
    max-width: 85%;
  }
  .bot-message {
    background-color: #f1f0f0;
    align-self: flex-start;
  }
  .user-message {
    background-color: #e1d9ff;
    align-self: flex-end;
  }
  .chat-input, .chat-select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 10px;
    font-size: 1em;
  }
  .query-option-button {
    display: block;
    width: 100%;
    background-color: #f1f0f0;
    border: 1px solid #ddd;
    padding: 12px;
    border-radius: 8px;
    margin-top: 8px;
    text-align: left;
    cursor: pointer;
  }
  .query-option-button:hover {
    background-color: #e1d9ff;
  }
  .chat-submit-button {
    width: 100%;
    background-color: #6633ff;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    margin-top: 15px;
  }
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }
`;

const SupportChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0); // 0: initial, 1: name, 2: query type, 3: message, 4: submitted
    const [formData, setFormData] = useState({ mobile: '', name: '', queryType: '', message: '' });
    const [error, setError] = useState('');
    const [apiMessage, setApiMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        // Validation for each step
        if (step === 0 && !/^\d{10}$/.test(formData.mobile)) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }
        if (step === 1 && formData.name.trim().length < 2) {
            setError("Please enter your name.");
            return;
        }
        setError('');
        setStep(s => s + 1);
    };

    const handleQueryTypeSelect = (type) => {
        setFormData(prev => ({ ...prev, queryType: type }));
        setStep(3);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.message.trim().length < 10) {
            setError("Please describe your query in at least 10 characters.");
            return;
        }
        setError('');

        try {
            // 👇 Apne server ka sahi URL yahan daalein
            const response = await fetch('http://localhost:8000/api/support/queries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }
            setApiMessage(result.message);
            setStep(4); // Go to submission success step
        } catch (err) {
            setError(err.message);
        }
    };
    
    const resetChat = () => {
        setFormData({ mobile: '', name: '', queryType: '', message: '' });
        setError('');
        setApiMessage('');
        setStep(0);
        setIsOpen(false);
    }

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div>
                        <div className="chat-message bot-message">Hello! First, please enter your mobile number.</div>
                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="chat-input" placeholder="10-digit mobile number" maxLength="10" />
                        <button onClick={nextStep} className="chat-submit-button">Next</button>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <div className="chat-message bot-message">Great! What's your name?</div>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="chat-input" placeholder="Your full name" />
                        <button onClick={nextStep} className="chat-submit-button">Next</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div className="chat-message bot-message">Thanks, {formData.name}. How can we help you today?</div>
                        {["Product Inquiry", "Order Status", "Payment Issue", "Other"].map(type => (
                            <button key={type} onClick={() => handleQueryTypeSelect(type)} className="query-option-button">{type}</button>
                        ))}
                    </div>
                );
            case 3:
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="chat-message bot-message">Please describe your query regarding "{formData.queryType}".</div>
                        <textarea name="message" value={formData.message} onChange={handleInputChange} className="chat-input" placeholder="Type your message here..." rows="4"></textarea>
                        <button type="submit" className="chat-submit-button">Submit Query</button>
                    </form>
                );
            case 4:
                return (
                    <div>
                        <div className="chat-message bot-message">{apiMessage || "Thank you! Your query is submitted."}</div>
                        <button onClick={resetChat} className="chat-submit-button">Start New Chat</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="support-chat-widget-container">
                {isOpen && (
                    <div className="support-chat-window">
                        <div className="chat-header">
                            <span>Support Chat</span>
                            <button onClick={() => setIsOpen(false)} className="close-button">&times;</button>
                        </div>
                        <div className="chat-body">
                            {renderStepContent()}
                            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                        </div>
                    </div>
                )}
                <button onClick={() => setIsOpen(!isOpen)} className="support-chat-button">
                    {isOpen ? '✕' : '💬'}
                </button>
            </div>
        </>
    );
};

export default SupportChatWidget;
