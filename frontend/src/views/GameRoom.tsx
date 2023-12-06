import { useState } from "react"
import { useLocation } from "react-router-dom"
import Chat from "./Chat"
import Icon from "@mui/material/Icon"
import { socket } from "../socket"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

export default function gameRoom() {
	const location = useLocation()
	const { props } = location.state || {}
	const [cards] = useState(props.cards)
	// const [playersNames] = useState(props.playersNames)
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
	const [waitingTruco, setWaitingTruco] = useState(false)

	const toggleChat = () => {
		const chat = document.querySelector("#chat")
		const button = document.querySelector("#toggleChatButton")
		chat?.classList.toggle("hidden")
		button?.classList.toggle("hidden")
	}

	const throwCard = () => {
		console.log("Players", props.playersNames)
	}

	const callTruco = () => {
		socket.emit("call_truco")
		setWaitingTruco(true)
	}

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
									<div className="col-span-1 items-center justify-center"></div>
									<div className="col-span-1 items-center justify-center"></div>
								</div>
							</div>
							<div className="row-span-3">
								<div className="grid h-full grid-cols-6">
									<div className="col-span-1 items-center justify-center">
										{/* <div className="relative left-1/2">
											{Array.from({ length: repeatCount }, (_, index) => (
												<div key={index}>
													<img
														className={`absolute 
													${
														(index == 0 && "z-1 left-3 top-1") ||
														(index == 1 && "z-2 left-2 top-2") ||
														(index == 2 && "z-3 left-1 top-3")
													}  
													w-10 -translate-x-1/2 transform p-0 md:w-16`}
														src={imageSrc}
														alt={`Repeated Image ${index}`}
													/>
												</div>
											))}
										</div> */}
									</div>
									<div className="col-span-4"></div>
									<div className="col-span-1">
										{/* <div className="relative left-1/2">
											{Array.from({ length: repeatCount }, (_, index) => (
												<div key={index}>
													<img
														className={`absolute 
														${
															(index == 0 && "z-1 left-3 top-1") ||
															(index == 1 && "z-2 left-2 top-2") ||
															(index == 2 && "z-3 left-1 top-3")
														}  
														w-10 -translate-x-1/2 transform p-0 md:w-16`}
														src={imageSrc}
														alt={`Repeated Image ${index}`}
													/>
												</div>
											))}
										</div> */}
									</div>
								</div>
							</div>
							<div className="row-span-2 grid grid-cols-3">
								<div></div>
								<div className="row-span-1 flex items-center justify-center">
									{cards.map((c: { code: null | undefined; url_image: string }, index: number) => (
										<button
											className={`m-1 w-16 transform transition-transform hover:translate-y-[-7px] md:w-28 ${
												hoveredIndex !== null && hoveredIndex !== index ? "blur-sm grayscale" : ""
											}`}
											key={c.code}
											onMouseEnter={() => setHoveredIndex(index)}
											onMouseLeave={() => setHoveredIndex(null)}
											onClick={throwCard}
										>
											<img className="img-responsive" src={c.url_image} />
										</button>
									))}
								</div>
								<div className="flex items-center">
									<Dialog>
										<DialogTrigger asChild>
											<Button className="bg-orange-500 hover:bg-orange-600" onClick={callTruco}>
												Trucar
											</Button>
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
