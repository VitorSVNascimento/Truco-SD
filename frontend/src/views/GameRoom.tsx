import Chat from "./Chat"
import Icon from "@mui/material/Icon"

export default function gameRoom() {
	const toggleChat = () => {
		const chat = document.querySelector("#chat")
		const button = document.querySelector("#toggleChatButton")
		chat?.classList.toggle("hidden")
		button?.classList.toggle("hidden")
	}

	return (
		<div className="min-h-screen bg-gradient-to-bl from-blue-700 via-blue-800 to-slate-700 text-white/90 md:grid md:grid-cols-5 md:content-normal md:gap-4 md:bg-white/90">
			<div className="md:col-span-4 md:justify-center"></div>
			<div
				id="chat"
				className="absolute left-0 top-0 hidden w-full md:relative md:col-span-1 md:block md:opacity-100"
			>
				<Chat />
			</div>
			<button
				id="toggleChatButton"
				className="absolute bottom-3 right-3 flex rounded-full bg-blue-400 p-3 text-gray-50 shadow-sm focus-within:bg-blue-700 focus-within:outline hover:bg-blue-600 disabled:bg-blue-300 md:hidden"
				type="button"
				onClick={toggleChat}
			>
				<Icon>chat</Icon>
			</button>
		</div>
	)
}
