import { useEffect, useContext, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import SocketContext from "../contexts/SocketContext"
import Icon from "@mui/material/Icon"
import WaitRoomPlayer from "../components/waitRoom/WaitRoomPlayer"

export default function waitRoom() {
	const socket = useContext(SocketContext)
	const { user } = useContext(UserContext)
	const navigate = useNavigate()
	const location = useLocation()
	const { props } = location.state
	const [playersNames, setPlayersNames] = useState<string[]>(props.playersNames)
	const isLeader = props.isLeader
	const [status, setStatus] = useState("")

	const handleStartGame = (event: React.FormEvent) => {
		event.preventDefault()

		if (socket.connected) {
			startGame()
		} else {
			socket.connect()

			socket.on("connect", () => {
				console.log("socket connected", socket)
			})
		}
	}

	const startGame = () => {
		if (status) setStatus("")
		socket.emit("start_game")
	}

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

			navigate("/gameRoom", {
				state: {
					props: {
						playersNames: [...playersNames],
						isLeader,
					},
				},
			})
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
			<div className="flex min-h-screen flex-col items-center gap-10 bg-slate-400 p-10 text-slate-100 md:gap-28">
				<div className="text-center">
					<Icon className="animate-spin duration-100" fontSize="large">
						hourglass_empty
					</Icon>
					<h1 className="text-3xl">Sala de Espera</h1>
					<h3 className={`
							${!isLeader && "invisible"}
						`}>Código da sala: {user && user["room"]}</h3>
				</div>
				<div className="grid w-full max-w-3xl grow grid-cols-2 gap-5">
					{playersNames?.map((playerName: any, index: number) => (
						<WaitRoomPlayer key={index} playerName={playerName} />
					))}
				</div>
				<div>
					<button
						className={`
							just rounded-md bg-green-500 p-2 shadow-sm hover:bg-green-700
							${!isLeader && "invisible"}
						`}
						onClick={handleStartGame}
					>
						Começar Jogo
					</button>
				</div>
			</div>
		</>
	)
}
