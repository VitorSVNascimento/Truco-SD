import { Message, User } from "../types/types"

export default function ChatMessage(props: { message: Message; user: User }) {
	return (
		<div
			className={`flex flex-col w-fit p-2 my-0.5 rounded-md ${
				props.message.userId === props.user?.id ? "self-end bg-green-400" : "bg-white"
			}`}
		>
			<div className="font-bold capitalize">{props.message.userName}:</div>
			<div>{props.message.text}</div>
		</div>
	)
}
