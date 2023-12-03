import { useState } from "react"
import Icon from "@mui/material/Icon"

export default function ChatMessageInput(props: { onSendMessage: (message: string) => void }) {
	const [message, setMessage] = useState("")

	const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (message && message.trim().length > 0) {
			props.onSendMessage(message)
			setMessage("")
		}
	}

	const hideChat = () => {
		const chat = document.querySelector("#chat")
		const button = document.querySelector("#toggleChatButton")
		chat?.classList.toggle("hidden")
		button?.classList.toggle("hidden")
	}

	return (
		<>
			<form className="flex items-center gap-3 bg-slate-300 p-3" onSubmit={sendMessage}>
				<input
					className="w-full rounded-full px-5 py-3 shadow-sm text-black"
					type="text"
					placeholder="Digite sua mensagem"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					autoFocus
				/>
				<button
					className="flex rounded-full bg-blue-400 p-3 text-gray-50 shadow-sm focus-within:outline focus-within:bg-blue-700 hover:bg-blue-600 disabled:bg-blue-300"
					type="submit"
					disabled={!message}
				>
					<Icon>send</Icon>
				</button>
				<button
					className="flex rounded-full md:hidden bg-blue-400 p-3 text-gray-50 shadow-sm focus-within:outline focus-within:bg-blue-700 hover:bg-blue-600 disabled:bg-blue-300"
					type="button"
					onClick={hideChat}
				>
					<Icon>speaker_notes_off</Icon>
				</button>
			</form>
		</>
	)
}
