import React from 'react';

interface message {
    user: {
        name: string;
        avatar: string;
    };
    content: string;
    time: string;
    id: string;
}


interface ConversationProps {
    messages: message[];
}


const Conversation: React.FC<ConversationProps> = ({ messages = [] }) => {
    return (
        <div className="conversation">
            {messages.map((mes) => (
                <div key={mes.id} className="mes">
                    <div className="avatar">
                        <img src={mes.user.avatar} alt="User Avatar" />
                    </div>
                    <div className="mes-content">
                        <div className="content">{mes.content}</div>
                        <div className="sender">{mes.user.name}</div>
                        <div className="time">{mes.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default Conversation;