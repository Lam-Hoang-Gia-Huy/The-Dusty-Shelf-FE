import React, { useState, useRef, useEffect } from 'react';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
    ConversationHeader
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { chatWithAi } from '../Service/AiChatService';

const AiChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "Xin chào! Tôi là trợ lý AI của Cửa hàng sách. Tôi có thể giúp gì cho bạn hôm nay?",
            sender: "AI",
            direction: "incoming"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "User"
        };

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const response = await chatWithAi(message);
            setMessages([
                ...newMessages,
                {
                    message: response.response,
                    sender: "AI",
                    direction: "incoming"
                }
            ]);
        } catch (error) {
            setMessages([
                ...newMessages,
                {
                    message: "Xin lỗi, đã xảy ra lỗi kết nối. Vui lòng thử lại sau.",
                    sender: "AI",
                    direction: "incoming",
                    type: "danger"
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={styles.chatWrapper}>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={styles.chatButton}
                >
                    💬 Chat với AI
                </button>
            )}

            {isOpen && (
                <div style={styles.chatBoxContainer}>
                    <MainContainer>
                        <ChatContainer>
                            <ConversationHeader>
                                <ConversationHeader.Content userName="Trợ lý ảo Cửa hàng sách" />
                                <ConversationHeader.Actions>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        style={styles.closeButton}
                                    >
                                        ✖
                                    </button>
                                </ConversationHeader.Actions>
                            </ConversationHeader>

                            <MessageList
                                scrollBehavior="smooth"
                                typingIndicator={isTyping ? <TypingIndicator content="AI đang gõ..." /> : null}
                            >
                                {messages.map((message, i) => (
                                    <Message key={i} model={message} />
                                ))}
                                <div ref={messagesEndRef} />
                            </MessageList>

                            <MessageInput
                                placeholder="Nhập tin nhắn..."
                                onSend={handleSend}
                                attachButton={false}
                            />

                            <div style={styles.suggestionsContainer}>
                                {["Danh mục sách", "Sách mới nhất", "Tìm sách dưới 200k"].map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(q)}
                                        style={styles.suggestionButton}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </ChatContainer>
                    </MainContainer>
                </div>
            )}
        </div>
    );
};

const styles = {
    chatWrapper: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
    },
    chatButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        padding: '12px 20px',
        fontSize: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    chatBoxContainer: {
        width: '350px',
        height: '500px',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        backgroundColor: 'white'
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#555'
    },
    suggestionsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderTop: '1px solid #eee'
    },
    suggestionButton: {
        backgroundColor: 'white',
        border: '1px solid #007bff',
        color: '#007bff',
        borderRadius: '15px',
        padding: '5px 12px',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
    }
};

export default AiChatBox;
