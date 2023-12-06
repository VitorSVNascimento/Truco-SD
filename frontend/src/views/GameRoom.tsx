import { useState } from "react"
import { useLocation } from "react-router-dom"
import Chat from "./Chat"
import { playAudio } from "../utils/utils"
import Icon from "@mui/material/Icon"
import GameRoomPlayer from "../components/gameRoom/GameRoomPlayer"

export default function gameRoom() {
	const location = useLocation()
	const { props } = location.state || {}
	const [ cards ] = useState(props.cards)
	const [ username ] = useState(props.username)
	// const [ playersNames ] = useState(props.playersNames)
	const [ roundOrder ] = useState(props.roundOrder)
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

	const TRICK_AUDIO = 7

	const toggleChat = () => {
		const chat = document.querySelector("#chat")
		const button = document.querySelector("#toggleChatButton")
		chat?.classList.toggle("hidden")
		button?.classList.toggle("hidden")
	}

	const throwCard = () => {
		console.log("Players", props.playersNames)
		console.log("Cartas", cards)
	}

	const callTruco = () => {
		playAudio(`sounds/truco-${Math.floor(Math.random() * TRICK_AUDIO)}.mp3`)
		console.log("TRUCOOOOOOOOOO")
	}

	const isMyTurn = () => {
		return roundOrder.length > 0 && username === roundOrder[0];
	};

	return (
		<div className="min-h-screen bg-gradient-to-bl from-blue-700 via-blue-800 to-slate-700 text-white/90 md:grid md:grid-cols-5 md:content-normal md:gap-4 md:bg-white/90">
			<div className="md:col-span-4 md:justify-center">
				<div className="m-0 grid h-full grid-rows-1 gap-2 p-2">
					{/* Mesa */}
					<div className="row-span-5 ">
						<div className="m-0 grid h-full grid-rows-6 gap-2 p-0 ">
							<div className="row-span-1 items-center justify-center">
								<div className="grid h-full grid-cols-3">
									<div className="col-span-1 items-center justify-center">

									</div>
									<div className="col-span-1 flex items-center justify-center">
										<GameRoomPlayer playerName="ZeLinguica" cardsNumber={3}/>
									</div>
									<div className="col-span-1 items-center justify-center">

									</div>
								</div>
							</div>

							<div className="row-span-3">
								<div className="grid h-full grid-cols-6">
									<div className="col-span-1 flex items-center justify-center">
										<GameRoomPlayer playerName="JaoBaitola" cardsNumber={1}/>
									</div>
									<div className="col-span-4 bg-green-500 border-4 border-orange-400 rounded-full">
										
									</div> 
									<div className="col-span-1 flex items-center justify-center">
										<GameRoomPlayer playerName="Chiquinha" cardsNumber={2}/>
									</div>
								</div>
							</div>

							<div className="row-span-2">
								<div className="grid h-full grid-cols-3">
									<div className="row-span-1 flex items-center justify-center">
										<button
											id="trucoButton"
											className="flex rounded-full bg-blue-500 p-3 text-gray-50 shadow-sm focus-within:bg-red-700 focus-within:outline hover:bg-red-600 disabled:bg-gray-500"
											type="button"
											onClick={callTruco}
											disabled={!isMyTurn()}
										>
											TRUUUUUUUCO
										</button>
										
									</div>
									<div className="row-span-1 flex items-center justify-center">
										{cards.map((c: { code: null | undefined; url_image: string }, index: number) => (
											<button
												className={`m-1 w-16 md:w-28 ${isMyTurn() ? "transform transition-transform hover:translate-y-[-7px]": ""} ${
													(!isMyTurn()) ? "grayscale opacity-80" : ((hoveredIndex !== null && hoveredIndex !== index) ? "blur-sm grayscale" : "")
												}`}
												key={c.code}
												onMouseEnter={() => setHoveredIndex(index)}
												onMouseLeave={() => setHoveredIndex(null)}
												onClick={throwCard}
												disabled={!isMyTurn()}
											>
												<img className="img-responsive" src={c.url_image} />
											</button>
										))}
									</div>
									<div className="row-span-1 flex items-center justify-center">
										<div className="blockfont-mono antialiased font-semibold text-2xl md:text-4xl">{username}</div>
										{isMyTurn() && (<div className="blockfont-mono antialiased font-semibold text-1xl md:text-2xl">Sua vez!</div>)}	
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
		</div>
	)
}
