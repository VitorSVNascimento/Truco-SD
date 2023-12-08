import { useState, useRef, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Message } from "../types/types"
import ChatMessageInput from "../components/chat/ChatMessageInput"
import ChatMessages from "../components/chat/ChatMessages"
import SocketContext from "../contexts/SocketContext"
import { UserContext } from "../contexts/UserContext"
import { playAudio } from "@/utils/utils"

export default function Chat() {
	const [messages, setMessages] = useState<Message[]>([])
	const messagesDivRef = useRef<HTMLDivElement>(null)
	const socket = useContext(SocketContext)
	const { user } = useContext(UserContext)
	const navigate = useNavigate()
	const [EASTER_EGG] = useState("Ao potência")

	useEffect(() => {
		console.log("user chat", user)
		if (user === null) {
			navigate("/")
		}

		socket.on("new_message", (message: Message) => {
			console.log("new_message", message)
			setMessages((prevMessages) => [...prevMessages, message])

			if (message.userId === user!.id) {
				setTimeout(() => {
					messagesDivRef.current?.scroll({
						top: messagesDivRef.current.scrollHeight,
						behavior: "smooth",
					})
				}, 0)
			}
			if (message.text.toLowerCase() === EASTER_EGG.toLowerCase())
				playAudio("sounds/ao-potencia.mp3")
		})

		socket.on("disconnect", () => {
			console.log("Disconnected")
		})

		// Cleanup function to remove the event listeners when the component unmounts
		return () => {
			socket.off("new_message")
		}
	}, [])

	const handleSendMessage = (message: string) => {
		console.log("message", message, user)
		socket.emit("message", {
			text: message,
			userId: user!.id,
			userName: user!.username,
			room: user!.room,
		})
	}

	return (
		<>
			<div className="flex max-h-screen min-h-screen flex-col">
				<ChatMessages messages={messages} ref={messagesDivRef} />
				<ChatMessageInput onSendMessage={handleSendMessage} />
			</div>
		</>
	)
}
