import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Message } from "../../types/types"
import { UserContext } from "../../contexts/UserContext"

export default function ChatMessage(props: { message: Message }) {
	const { user } = useContext(UserContext)
	const navigate = useNavigate()

	useEffect(() => {
		if (user === null) {
			navigate("/")
		}
	}, [])

	return (
		<div
			className={`my-0.5 flex flex-col rounded-md p-2 ${
				props.message.userId
					? props.message.userId === user!.id
						? "w-fit self-end bg-blue-600"
						: "w-fit bg-blue-400"
					: `${props.message.bgColor} text-center opacity-100 shadow`
			}`}
		>
			{props.message.userName && (
				<div className="font-bold capitalize">{props.message.userName}:</div>
			)}
			<div>{props.message.text}</div>
		</div>
	)
}
