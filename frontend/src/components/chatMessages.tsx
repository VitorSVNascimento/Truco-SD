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
				className="flex flex-col flex-grow bg-slate-200 p-3 overflow-y-auto overflow-x-hidden break-all scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-50"
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
