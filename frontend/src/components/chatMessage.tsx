import { Message, User } from "../types/types"

export default function ChatMessage(props: { message: Message; user: User }) {
	return (
		<div
			className={`my-0.5 flex w-fit flex-col rounded-md p-2 ${
				props.message.userId === props.user?.id ? "self-end bg-green-400" : "bg-white"
			}`}
		>
			<div className="font-bold capitalize">{props.message.userName}:</div>
			<div>{props.message.text}</div>
		</div>
	)
}
