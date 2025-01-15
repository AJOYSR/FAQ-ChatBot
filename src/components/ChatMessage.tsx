import React from "react";
import { MessageCircle, Bot } from "lucide-react";
import parse from "html-react-parser";

interface ChatMessageProps {
	message: string;
	isBot: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot }) => {
	return (
		<div
			className={`flex items-start gap-2 ${
				isBot ? "flex-row" : "flex-row-reverse"
			}`}
		>
			<div
				className={`p-2 rounded-full ${isBot ? "bg-blue-100" : "bg-gray-100"}`}
			>
				{isBot ? <Bot size={20} /> : <MessageCircle size={20} />}
			</div>
			<div
				className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
					isBot ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"
				}`}
			>
				{parse(message)}
			</div>
		</div>
	);
};

export default ChatMessage;
