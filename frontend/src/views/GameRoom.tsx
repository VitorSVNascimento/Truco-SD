import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Chat from "./Chat"
import { playAudio } from "../utils/utils"
import Icon from "@mui/material/Icon"
import { socket } from "../socket"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import GameRoomPlayer from "../components/gameRoom/GameRoomPlayer"

export default function gameRoom() {
	const location = useLocation()
	const { props } = location.state || {}
	const [cards, setCards] = useState(props.cards)
	const [player] = useState(props?.player)
	// const [ players ] = useState(props?.players)
	const [roundOrder] = useState(props?.roundOrder)
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
	const [waitingAcceptTruco, setWaitingAcceptTruco] = useState(false)
	const [trucoRequested, setTrucoRequested] = useState(false)
	const [tableOrder, setTableOrder] = useState<any[]>([])
	const [myTurn] = useState(roundOrder.length > 0 && player.name === roundOrder[0])
	const [TRICK_AUDIO] = useState(7)
	const [PLAYER_POSITION_TOP] = useState(2)
	const [PLAYER_POSITION_RIGHT] = useState(1)
	const [PLAYER_POSITION_LEFT] = useState(3)

	const toggleChat = () => {
		const chat = document.querySelector("#chat")
		const button = document.querySelector("#toggleChatButton")
		chat?.classList.toggle("hidden")
		button?.classList.toggle("hidden")
	}

	const throwCard = (code: any) => {
		setCards(cards.filter((card: { code: string }) => card.code != code))
		// eslint-disable-next-line camelcase
		socket.emit("throw_card", { card_code: code })
		console.log("Cartas", cards)
	}

	const callTruco = () => {
		socket.emit("call_truco")
		console.log("TRUCOOOOOOOOOO")
	}

	const acceptTruco = () => {
		socket.emit("accept_truco")
		setTrucoRequested(false)
	}

	const declineTruco = () => {
		socket.emit("decline_truco")
		setTrucoRequested(false)
	}

	const raiseTruco = () => {
		socket.emit("call_truco")
		setTrucoRequested(false)
	}

	const reorganizeTableOrder = () => {
		const playerIndex = roundOrder.indexOf(player.name)

		const newArray = roundOrder
			.slice(playerIndex)
			.concat(roundOrder.slice(0, playerIndex))
			.map((playerName: string) => ({
				name: playerName,
				cardsCount: 3,
			}))

		setTableOrder(newArray)
	}

	useEffect(() => {
		reorganizeTableOrder()
	}, [])

	useEffect(() => {
		socket.on("receive_truco", (data: any) => {
			console.log("receive_truco", data)
			playAudio(`sounds/truco-${Math.floor(Math.random() * TRICK_AUDIO)}.mp3`)
			if (data.team == player.team) setWaitingAcceptTruco(true)
			else setTrucoRequested(true)
		})

		socket.on("accepted_truco", (data) => {
			console.log("accepted_truco", data)
			if (waitingAcceptTruco) setWaitingAcceptTruco(false)
			else setTrucoRequested(false)
		})

		socket.on("declined_truco", (data) => {
			console.log("declined_truco", data)
			if (waitingAcceptTruco) setWaitingAcceptTruco(false)
			else setTrucoRequested(false)
		})

		socket.on("throwed_card", (data) => {
			console.log("throwed_card", data)
		})

		socket.on("your_cards", (cards: any) => {
			console.log("your_cards", cards)
			// setCards(cards)
		})

		return () => {
			socket.off("receive_truco")
			socket.off("accepted_truco")
			socket.off("declined_truco")
			socket.off("throwed_card")
			socket.off("your_cards")
		}
	}, [waitingAcceptTruco])

	return (
		<div className="min-h-screen bg-gradient-to-bl from-blue-700 via-blue-800 to-slate-700 text-white/90 md:grid md:grid-cols-5 md:content-normal md:gap-4 md:bg-white/90">
			<div className="md:col-span-4 md:justify-center">
				<div className="m-0 grid h-full grid-rows-1 gap-2 p-2">
					{/* Mesa */}
					<div className="row-span-5 ">
						<div className="m-0 grid h-full grid-rows-6 gap-2 p-0 ">
							<div className="row-span-1 items-center justify-center">
								<div className="grid h-full grid-cols-3">
									<div className="col-span-1 items-center justify-center"></div>
									<div className="col-span-1 flex items-center justify-center">
										{tableOrder.length > PLAYER_POSITION_TOP && (
											<GameRoomPlayer
												playerName={tableOrder[PLAYER_POSITION_TOP].name}
												cardsNumber={tableOrder[PLAYER_POSITION_TOP].cardsCount}
											/>
										)}
									</div>
									<div className="col-span-1 items-center justify-center"></div>
								</div>
							</div>

							<div className="row-span-3">
								<div className="grid h-full grid-cols-8 gap-2">
									<div className="col-span-2 flex items-center justify-center">
										{tableOrder.length > PLAYER_POSITION_LEFT && (
											<GameRoomPlayer
												playerName={tableOrder[PLAYER_POSITION_LEFT].name}
												cardsNumber={tableOrder[PLAYER_POSITION_LEFT].cardsCount}
											/>
										)}
									</div>
									<div className="col-span-4 rounded-full border-4 border-orange-400 bg-green-500"></div>
									<div className="col-span-2 flex items-center justify-center">
										{tableOrder.length > PLAYER_POSITION_RIGHT && (
											<GameRoomPlayer
												playerName={tableOrder[PLAYER_POSITION_RIGHT].name}
												cardsNumber={tableOrder[PLAYER_POSITION_RIGHT].cardsCount}
											/>
										)}
									</div>
								</div>
							</div>

							<div className="row-span-2">
								<div className="grid h-full grid-cols-3">
									<div className="row-span-1 flex items-center justify-center">
										<Dialog open={waitingAcceptTruco}>
											<DialogTrigger asChild>
												<button
													id="trucoButton"
													className="flex rounded-full bg-blue-500 p-3 text-gray-50 shadow-sm focus-within:bg-red-700 focus-within:outline hover:bg-red-600 disabled:bg-gray-500"
													type="button"
													onClick={callTruco}
													disabled={!myTurn || waitingAcceptTruco}
												>
													TRUUUUUUUCO
												</button>
											</DialogTrigger>
											<DialogContent className="bg-slate-700 sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle className="text-slate-100">Truco</DialogTitle>
													<DialogDescription></DialogDescription>
												</DialogHeader>
												<div className="grid gap-4 py-4 text-slate-300">
													Aguardando jogadores adversários...
												</div>
											</DialogContent>
										</Dialog>
									</div>
									<div className="row-span-1 flex items-center justify-center">
										{cards.map(
											(c: { code: null | undefined; url_image: string }, index: number) => (
												<button
													className={`m-1 w-14 md:w-28 ${
														myTurn ? "transform transition-transform hover:translate-y-[-7px]" : ""
													} ${
														!myTurn
															? "opacity-80 grayscale"
															: hoveredIndex !== null && hoveredIndex !== index
															? "blur-sm grayscale"
															: ""
													}`}
													key={c.code}
													onMouseEnter={() => setHoveredIndex(index)}
													onMouseLeave={() => setHoveredIndex(null)}
													onClick={() => throwCard(c.code)}
													disabled={!myTurn}
												>
													<img className="img-responsive" src={c.url_image} />
												</button>
											),
										)}
									</div>
									<div className="row-span-1 flex items-center justify-center gap-2">
										<div className="grid grid-rows-2">
											<div className="row-span-1 font-mono text-2xl font-semibold capitalize antialiased md:text-4xl">
												{player.name}
											</div>
											{myTurn && (
												<div className="text-1xl row-span-1 font-mono font-semibold antialiased md:text-2xl">
													Sua vez!
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
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
			<Dialog open={trucoRequested}>
				<DialogContent className="bg-slate-700 sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle className="text-slate-100">Truco</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="text-center text-slate-300">O time adversário pediu truco!</div>
						<div className="flex gap-4">
							<button className="rounded-md bg-green-500 p-2 text-slate-100" onClick={acceptTruco}>
								Aceitar
							</button>
							<button className="rounded-md bg-red-500 p-2 text-slate-100" onClick={declineTruco}>
								Correr
							</button>
							<button className="rounded-md bg-orange-500 p-2 text-slate-100" onClick={raiseTruco}>
								Aumentar
							</button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
