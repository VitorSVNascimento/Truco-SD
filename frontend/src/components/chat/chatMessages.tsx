import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ChatMessage from "./chatMessage"
import { Message } from "../../types/types"
import { UserContext } from "../../contexts/UserContext"

interface ChatMessagesProps {
	messages: Message[]
}

const ChatMessages = React.forwardRef<HTMLDivElement, ChatMessagesProps>((props, ref) => {
	const { user } = useContext(UserContext)
	const navigate = useNavigate()

	useEffect(() => {
		if (user === null) {
			navigate("/")
		}
	}, [])

	return (
		<>
			<div
				ref={ref}
				className="flex flex-grow flex-col overflow-y-auto overflow-x-hidden break-all bg-slate-200 p-3 scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-400"
			>
				{props.messages?.map((message) => <ChatMessage key={message.id} message={message} />)}
			</div>
		</>
	)
})

ChatMessages.displayName = "ChatMessages"
export default ChatMessages
