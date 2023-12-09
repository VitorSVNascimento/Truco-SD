import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Chat from "./Chat"
import { playAudio } from "../utils/utils"
import Icon from "@mui/material/Icon"
import { socket } from "../socket"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import GameRoomPlayer from "../components/gameRoom/GameRoomPlayer"
import { EventData } from "../types/types"

export default function gameRoom() {
	const location = useLocation()
	const { props } = location.state || {}
	const [cards, setCards] = useState(props?.cards)
	const [partnerCards, setPartnerCards] = useState([])
	const [player] = useState(props?.player)
	const [players] = useState(props?.players)
	const [roundOrder, setRoundOrder] = useState(props?.roundOrder)
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
	const [waitingAcceptTruco, setWaitingAcceptTruco] = useState(false)
	const [waitingPartnerTruco, setWaitingPartnerTruco] = useState(false)
	const [partnerTrucoResponse, setPartnerTrucoResponse] = useState(0)
	const [trucoRequested, setTrucoRequested] = useState(false)
	const [CARD_PATTERN] = useState("")
	const [tableOrder, setTableOrder] = useState<any[]>([])
	const [turn, setTurn] = useState<number>(0)
	const [myTurn, setMyTurn] = useState(roundOrder?.length > 0 && player?.name === roundOrder[turn])
	const [TRICK_AUDIO] = useState(8)
	const [PLAYER_POSITION_BOTTOM] = useState(0)
	const [PLAYER_POSITION_RIGHT] = useState(1)
	const [PLAYER_POSITION_TOP] = useState(2)
	const [PLAYER_POSITION_LEFT] = useState(3)
	const [roundValue, setRoundValue] = useState(2)
	const [TEAM_1] = useState(0)
	const [TEAM_2] = useState(1)
	const [teamPoints, setTeamPoints] = useState<any[]>([
		{ id: 1, points: 0, games: 0 },
		{ id: 2, points: 0, games: 0 },
	])
	const [proposedHandValue, setProposedHandValue] = useState(2)
	const [NULL_POINT] = useState(0)
	const [TEAM_POINT] = useState(1)
	const [OPPONENT_POINT] = useState(2)
	const [DRAW_POINT] = useState(3)
	const [POINT_IMAGE] = useState("-point.svg")
	const [handPoints, setHandPoints] = useState<number[]>([NULL_POINT, NULL_POINT, NULL_POINT])
	const [round, setRound] = useState(0)
	const [playerCalledTrick, setPlayerCalledTrick] = useState(false)
	const [chatEvent, setChatEvent] = useState<EventData>({
		event: "",
		data: {},
	})
	const [showTenHandDialog, setShowTenHandDialog] = useState(false)

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
	}

	const callTruco = () => {
		socket.emit("call_truco")
		console.log("TRUCOOOOOOOOOO")
		setPlayerCalledTrick(true)
	}

	const acceptTruco = () => {
		socket.emit("accept_truco")
		setTrucoRequested(false)
	}

	const declineTruco = () => {
		socket.emit("decline_truco")
	}

	const raiseTruco = () => {
		socket.emit("call_truco")
		setTrucoRequested(false)
	}

	const resetTableOrder = () => {
		const newArray = roundOrder
			.slice(roundOrder.indexOf(player.name))
			.concat(roundOrder.slice(0, roundOrder.indexOf(player.name)))
			.map((playerName: string) => ({
				name: playerName,
				cardsCount: 3,
				lastThrowedCardImg: CARD_PATTERN,
			}))

		setTableOrder(newArray)
	}

	const updateTableOrder = (newData: any) => {
		return tableOrder?.map((player) => {
			if (player.name === newData.username) {
				return {
					...player,
					cardsCount: player.cardsCount - 1,
					lastThrowedCardImg: newData.card.url_image,
				}
			}
			return player
		})
	}

	const roundResetTableOrder = () => {
		setTableOrder(
			tableOrder?.map((player) => {
				return {
					...player,
					lastThrowedCardImg: CARD_PATTERN,
				}
			}),
		)
	}

	const updateRoundPoints = (index: number, newValue: number) => {
		const newArray = handPoints.map((value, i) => (index === -1 || index === i ? newValue : value))
		setHandPoints(newArray)
	}

	const acceptTenHand = () => {
		socket.emit("accept_ten_hand")
	}

	const declineTenHand = () => {
		socket.emit("decline_ten_hand")
	}

	const resetGlobalScore = (score: any[]) => {
		setTeamPoints(
			teamPoints?.map((team) => {
				return {
					...team,
					points: 0,
					games: score[team.id - 1],
				}
			}),
		)
	}

	useEffect(() => {
		resetTableOrder()
	}, [])

	useEffect(() => {
		socket.on("receive_truco", (data: any) => {
			console.log("receive_truco", data)
			playAudio(`sounds/truco-${Math.floor(Math.random() * TRICK_AUDIO)}.mp3`)
			setPartnerTrucoResponse(0)
			if (data.team == player.team) setWaitingAcceptTruco(true)
			else {
				setTrucoRequested(true)
				setWaitingAcceptTruco(false)
				setProposedHandValue(data["proposed_value"])
			}
		})

		socket.on("accepted_truco", (data) => {
			console.log("accepted_truco", data)

			setRoundValue(data["new_hand_value"])
			if (waitingAcceptTruco) {
				setWaitingAcceptTruco(false)

				const event = {
					event: "chat_accepted_truco",
					data: {
						message: "",
					},
				}

				switch (data["new_hand_value"]) {
					case 4:
						event.data.message = "O adversário aceitou o truco!"
						break
					case 8:
						event.data.message = "O adversário aceitou o pedido de 6!"
						break
					case 10:
						event.data.message = "O adversário aceitou o pedido de 9!"
						break
					case 12:
						event.data.message = "O adversário aceitou o pedido de 12!"
						break
				}

				setChatEvent(event)
				setTimeout(() => {
					setChatEvent({ event: "", data: {} })
				}, 1000)
			} else {
				setTrucoRequested(false)
			}
		})

		socket.on("declined_truco", (data) => {
			console.log("declined_truco", data)
			if (waitingAcceptTruco) {
				setWaitingAcceptTruco(false)
				const event = {
					event: "chat_declined_truco",
					data: {
						message: "",
					},
				}

				switch (roundValue) {
					case 2:
						event.data.message = "O adversário recusou o truco!"
						break
					case 4:
						event.data.message = "O adversário recusou o pedido de 6!"
						break
					case 8:
						event.data.message = "O adversário recusou o pedido de 9!"
						break
					case 10:
						event.data.message = "O adversário recusou o pedido de 12!"
						break
				}

				setChatEvent(event)
				setTimeout(() => {
					setChatEvent({ event: "", data: {} })
				}, 1000)
			} else setTrucoRequested(false)
			setWaitingPartnerTruco(false)
		})

		socket.on("your_cards", (data: any) => {
			console.log("your_cards", data)
			setCards(data.cards)
		})

		socket.on("end_hand", (data: any) => {
			console.log("end_hand", data)

			let isHandWinner = false

			if (data["winner"] == player.team) isHandWinner = true

			const event = {
				event: "chat_end_hand",
				data: {
					message: "",
				},
			}

			if (isHandWinner) {
				event.data.message = "Seu time venceu a mão!"
			} else {
				event.data.message = "O adversário venceu a mão!"
			}

			setTeamPoints(
				teamPoints?.map((team) => {
					const currentIndex = team.id - 1
					if (team.id == data["winner"]) {
						team.points = data["game_score"][currentIndex]
						console.log({ team })
						return team
					}
					return team
				}),
			)

			console.log("teamPoints", teamPoints)

			setChatEvent(event)
			setTimeout(() => {
				setChatEvent({ event: "", data: {} })
			}, 1000)

			if (data["game_score"][0] == 0 && data["game_score"][1] == 0) {
				if (teamPoints.some((team: any) => team.points == 0)) {
					playAudio("sounds/ao-potencia.mp3")
				}
				resetGlobalScore(data["overall_score"])
			}

			setWaitingPartnerTruco(false)
			// eslint-disable-next-line camelcase
			setRoundOrder(data.new_order)
			roundResetTableOrder()
			setTurn(0)
			setPlayerCalledTrick(false)
			updateRoundPoints(-1, NULL_POINT)
			setRound(0)
			setRoundValue(2)
			playAudio("sounds/shufflingCards.wav")
			resetTableOrder()
		})

		socket.on("waiting_truco", (data) => {
			console.log("waiting_truco", data)
			if (data["username"] === player.name) {
				setWaitingPartnerTruco(true)
			} else {
				const dataPlayer = players.find((el: any) => el.name === data["username"])

				if (dataPlayer?.team == player.team) {
					setPartnerTrucoResponse(data["response"])
				}
			}
		})

		socket.on("ten_hand", (data) => {
			console.log("ten_hand", data, socket.id)
			setShowTenHandDialog(true)
			setPartnerCards(data["partner_cards"])
		})

		socket.on("accepted_ten_hand", (data) => {
			console.log("accepted_ten_hand", data)
			setShowTenHandDialog(false)
			setRoundValue(4)
		})

		socket.on("declined_ten_hand", (data) => {
			console.log("declined_ten_hand", data)
			setShowTenHandDialog(false)
		})

		return () => {
			socket.off("receive_truco")
			socket.off("accepted_truco")
			socket.off("declined_truco")
			socket.off("your_cards")
			socket.off("end_hand")
			socket.off("waiting_truco")
			socket.off("ten_hand")
			socket.off("accepted_ten_hand")
			socket.off("declined_ten_hand")
		}
	}, [waitingAcceptTruco, roundValue, teamPoints])

	useEffect(() => {
		socket.on("throwed_card", (data) => {
			setTableOrder(updateTableOrder(data))
			setTurn(turn + 1)
			playAudio(`sounds/${Math.floor(Math.random() * 2)}-flip.mp3`)
			console.log("throwed card", data)
		})

		socket.on("end_round", (data) => {
			console.log("end_round", data)
			// eslint-disable-next-line camelcase
			setRoundOrder(data.new_order)
			roundResetTableOrder()
			setTurn(0)
			setPlayerCalledTrick(false)
			updateRoundPoints(
				round,
				data.team == player.team ? TEAM_POINT : data.team == 3 ? DRAW_POINT : OPPONENT_POINT,
			)
			setRound(round + 1)
		})

		return () => {
			socket.off("throwed_card")
			socket.off("end_round")
		}
	}, [cards, tableOrder, roundOrder, turn])

	useEffect(() => {
		setMyTurn(roundOrder.length > 0 && player.name === roundOrder[turn])
	}, [turn, roundOrder])

	return (
		<div className="min-h-screen bg-green-700 text-white/90 md:grid md:grid-cols-5 md:content-normal md:gap-4">
			<div className="md:col-span-4 md:justify-center">
				<div className="m-0 grid h-full grid-rows-1 gap-2 p-2">
					{/* Mesa */}
					<div className="row-span-5 ">
						<div className="m-0 grid h-full grid-rows-6 gap-2 p-0 ">
							<div className="row-span-1 items-center justify-center">
								<div className="grid h-full grid-cols-3">
									{/* Placar da mão*/}
									<div className="col-span-1 row-span-1 grid grid-rows-2 items-center justify-center font-mono text-xs font-semibold md:text-base 2xl:text-2xl">
										<div className="row-span-1">Pontos da mão: </div>
										<div className="row-span-1 grid grid-cols-3">
											<img
												className="m-1 w-5 p-0 md:w-9 2xl:w-14"
												src={`${handPoints[0]}${POINT_IMAGE}`}
											/>
											<img
												className="m-1 w-5 p-0 md:w-9 2xl:w-14"
												src={`${handPoints[1]}${POINT_IMAGE}`}
											/>
											<img
												className="m-1 w-5 p-0 md:w-9 2xl:w-14"
												src={`${handPoints[2]}${POINT_IMAGE}`}
											/>
										</div>
									</div>
									<div className="col-span-1 flex items-center justify-center">
										{tableOrder.length > PLAYER_POSITION_TOP && (
											<GameRoomPlayer
												playerName={tableOrder[PLAYER_POSITION_TOP].name}
												cardsNumber={tableOrder[PLAYER_POSITION_TOP].cardsCount}
											/>
										)}
									</div>
									<div className="col-span-1 row-span-1 grid grid-rows-1 items-center justify-center font-mono text-xs font-semibold md:text-base 2xl:text-2xl">
										<table className="row-span-1 table-fixed items-center justify-center text-center">
											<thead>
												<tr>
													<th></th>
													<th className="border pl-2 pr-2">Pontos</th>
													<th className="border pl-2 pr-2">Tentos</th>
													<th className="border pl-2 pr-2">Jogos</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className="border pl-2 pr-2">Time 1</td>
													<td className="border pl-2 pr-2">{teamPoints[TEAM_1]?.points}</td>
													<td rowSpan={2} className="border pl-2 pr-2 text-2xl md:text-3xl">
														{roundValue}
													</td>
													<td className="border pl-2 pr-2">{teamPoints[TEAM_1]?.games}</td>
												</tr>
												<tr>
													<td className="border pl-2 pr-2">Time 2</td>
													<td className="border pl-2 pr-2">{teamPoints[TEAM_2]?.points}</td>
													<td className="border pl-2 pr-2">{teamPoints[TEAM_2]?.games}</td>
												</tr>
											</tbody>
										</table>
									</div>
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
									<div className="col-span-4 grid h-full grid-cols-3 rounded-full border-4 border-orange-400 bg-yellow-400 bg-[url('/table.png')] bg-contain bg-center bg-no-repeat">
										<div className="col-span-1 flex items-center justify-center">
											{/* LEFT */}
											{tableOrder.length > PLAYER_POSITION_LEFT && (
												<img
													className="m-1 w-9 p-0 md:w-14 2xl:w-20"
													src={tableOrder[PLAYER_POSITION_LEFT].lastThrowedCardImg}
												/>
											)}
										</div>
										<div className="col-span-1 grid h-full grid-rows-2">
											<div className="col-span-1 flex items-center justify-center">
												{/* TOP */}
												{tableOrder.length > PLAYER_POSITION_TOP && (
													<img
														className="m-1 w-9 p-0 md:w-14 2xl:w-20"
														src={tableOrder[PLAYER_POSITION_TOP].lastThrowedCardImg}
													/>
												)}
											</div>
											<div className="col-span-1 flex items-center justify-center">
												{/* BOTTOM */}
												{tableOrder.length > PLAYER_POSITION_BOTTOM && (
													<img
														className="m-1 w-9 p-0 md:w-14 2xl:w-20"
														src={tableOrder[PLAYER_POSITION_BOTTOM].lastThrowedCardImg}
													/>
												)}
											</div>
										</div>
										<div className="col-span-1 flex items-center justify-center">
											{/* RIGHT */}
											{tableOrder.length > PLAYER_POSITION_RIGHT && (
												<img
													className="m-1 w-9 p-0 md:w-14 2xl:w-20"
													src={tableOrder[PLAYER_POSITION_RIGHT].lastThrowedCardImg}
												/>
											)}
										</div>
									</div>
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
								<div className="grid grid-cols-3 md:h-full">
									<div className="row-span-1 flex items-center justify-center">
										<Dialog open={waitingAcceptTruco}>
											<DialogTrigger asChild>
												<button
													id="trucoButton"
													className="flex rounded-full bg-blue-500 p-3 text-gray-50 shadow-sm focus-within:bg-blue-700 focus-within:outline hover:bg-blue-600 disabled:bg-gray-500"
													type="button"
													onClick={callTruco}
													disabled={
														!myTurn ||
														waitingAcceptTruco ||
														roundValue > 10 ||
														playerCalledTrick ||
														teamPoints[TEAM_1]?.points >= 10 ||
														teamPoints[TEAM_2]?.points >= 10
													}
												>
													{(() => {
														switch (roundValue) {
															case 2:
																return "TRUUUUUUUCO"
															case 4:
																return "SEIS SÓ"
															case 8:
																return "VALE NOVE"
															case 10:
																return "DOZEE NELE!"
															default:
																return "Chega meu fi"
														}
													})()}
												</button>
											</DialogTrigger>
											<DialogContent className="bg-slate-700 sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle className="text-slate-100">Truco</DialogTitle>
												</DialogHeader>
												<div className="grid gap-4 text-slate-300">
													Aguardando jogadores adversários...
												</div>
											</DialogContent>
										</Dialog>
									</div>
									<div className="row-span-1 flex items-center justify-center">
										{cards?.map(
											(c: { code: null | undefined; url_image: string }, index: number) => (
												<button
													className={`ml-1 mr-1 w-14 md:w-28 ${
														myTurn
															? "md:transform md:transition-transform md:hover:translate-y-[-7px]"
															: ""
													} ${
														!myTurn
															? "opacity-80 grayscale"
															: hoveredIndex !== null && hoveredIndex !== index
															? "md:blur-sm md:grayscale"
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
									<div className="row-span-1 flex items-center justify-center">
										<div className="grid grid-rows-3">
											<div className="row-span-1 truncate font-mono text-2xl font-semibold capitalize antialiased md:text-4xl">
												{player?.name}
											</div>
											<div className="row-span-1 font-mono text-xs font-semibold antialiased md:text-base">
												Time {player?.team}
											</div>
											<div
												className={`text-1xl row-span-1 font-mono font-semibold antialiased md:text-2xl ${
													myTurn ? "" : "opacity-0"
												}`}
											>
												Seu turno!
											</div>
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
				<Chat player={player} event={chatEvent} />
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
					</DialogHeader>
					<div className="grid gap-4">
						<div className="text-slate-300">
							O time adversário pediu
							{(() => {
								switch (proposedHandValue) {
									case 4:
										return " truco"
									case 8:
										return " 6"
									case 10:
										return " 9"
									case 12:
										return " 12"
								}
							})()}
						</div>
						{(() => {
							switch (partnerTrucoResponse) {
								case 1:
									return <div className="text-green-400">Seu parceiro aceitou!</div>
								case 2:
									return <div className="text-red-400">Seu parceiro correu!</div>
							}
						})()}
						<div className="flex gap-4">
							<button className="rounded-md bg-green-500 p-2 text-slate-100" onClick={acceptTruco}>
								Aceitar
							</button>
							<button className="rounded-md bg-red-500 p-2 text-slate-100" onClick={declineTruco}>
								Correr
							</button>
							{proposedHandValue <= 10 && (
								<button
									className="rounded-md bg-orange-500 p-2 text-slate-100"
									onClick={raiseTruco}
								>
									{(() => {
										switch (proposedHandValue) {
											case 4:
												return "Pedir 6"
											case 8:
												return "Pedir 9"
											case 10:
												return "Pedir 12"
										}
									})()}
								</button>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog open={waitingPartnerTruco}>
				<DialogContent className="bg-slate-700 sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle className="text-slate-100">Truco</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 text-slate-300">
						Aguardando parceiro responder pedido de truco...
					</div>
				</DialogContent>
			</Dialog>
			<Dialog open={showTenHandDialog}>
				<DialogContent className="bg-slate-700 sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle className="text-slate-100">Mão de 10</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-3 text-slate-300">
						<div>
							Suas Cartas:
							<div className="row-span-1 flex items-center justify-center">
								{cards?.map((c: { code: null | undefined; url_image: string }) => (
									<img key={c.code} className="w-16 pl-2 pr-2 md:w-32" src={c.url_image} />
								))}
							</div>
						</div>
						<div>
							Cartas do parceiro:
							<div className="row-span-1 flex items-center justify-center">
								{partnerCards?.map((c: { code: null | undefined; url_image: string }) => (
									<div key={c.code}>
										<img className="w-16 pl-2 pr-2 md:w-32" src={c.url_image} />
									</div>
								))}
							</div>
						</div>
						<div className="flex gap-3">
							<button
								className="rounded-md bg-green-500 p-2 text-slate-100"
								onClick={acceptTenHand}
							>
								Jogar
							</button>
							<button className="rounded-md bg-red-500 p-2 text-slate-100" onClick={declineTenHand}>
								Correr
							</button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
