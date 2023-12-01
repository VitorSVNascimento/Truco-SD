import { useEffect, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import SocketContext from "../contexts/SocketContext"
import Icon from "@mui/material/Icon"
import WaitRoomPlayer from "../components/waitRoom/WaitRoomPlayer"

export default function waitRoom() {
	const socket = useContext(SocketContext)
	const { user } = useContext(UserContext)
	const navigate = useNavigate()
	const [playersNames, setPlayersNames] = useState<string[]>(["test"])

	useEffect(() => {
		console.log("user waitRoom", user)
		if (user === null) {
			navigate("/")
		}

		socket.on("connect_successfully", (data: any) => {
			console.log("connect_successfully", playersNames)
			const players = data["players"]
			const team1 = players.at(0)
			const team2 = players.at(1)
			setPlayersNames([...team1, ...team2])
		})

		socket.on("your_cards", (cards: any) => {
			console.log("your_cards", cards)
		})

		socket.on("disconnect", () => {
			console.log("Disconnected")
		})

		// Cleanup function to remove the event listeners when the component unmounts
		return () => {
			socket.off("your_cards")
		}
	}, [])

	return (
		<>
			<div className="flex min-h-screen flex-col items-center gap-3 bg-slate-400 p-3 text-slate-100">
				<div className="text-center">
					<h1>Sala de Espera</h1>
					<Icon className="me-auto">hourglass_empty</Icon>
				</div>
				<div className="flex grow content-center items-center">
					{playersNames?.map((playerName: any) => (
						<WaitRoomPlayer key={playerName} playerName={playerName} />
					))}
				</div>
				<div>
					<button className="rounded-md bg-green-500 p-2 hover:bg-green-700">Começar Jogo</button>
				</div>
			</div>
		</>
	)
}
