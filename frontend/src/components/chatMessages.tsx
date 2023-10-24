import React from "react"
import ChatMessage from "./chatMessage"
import { Message, User } from "../types/types"

interface ChatMessagesProps {
	messages: Message[]
	user: User
}

const ChatMessages = React.forwardRef<HTMLDivElement, ChatMessagesProps>((props, ref) => {
	return (
		<>
			<div
				ref={ref}
				className="flex flex-grow flex-col overflow-y-auto overflow-x-hidden break-all bg-slate-200 p-3 scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-400"
			>
				{props.messages?.map((message) => (
					<ChatMessage key={message.id} message={message} user={props.user} />
				))}
			</div>
		</>
	)
})

ChatMessages.displayName = "ChatMessages"
export default ChatMessages
