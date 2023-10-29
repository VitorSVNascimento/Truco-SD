import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import SocketContext from "../contexts/SocketContext"
import Icon from "@mui/material/Icon"

export default function Home() {
	const { user, setUser } = useContext(UserContext)
	const socket = useContext(SocketContext)
	const [username, setUsername] = useState("")
	const navigate = useNavigate()
	const [firstConnect, setFirstConnect] = useState(false)
	const [status, setStatus] = useState("")
	const [room, setRoom] = useState("")
	const [roomStatus, setRoomStatus] = useState("")

	const handleCreateRoom = (event: React.FormEvent) => {
		event.preventDefault()

		if (!checkName(username)) return

		if (socket.connected) {
			createGame()
		} else {
			socket.connect()

			socket.on("connect", () => {
				console.log("Connected handle", socket)

				if (!firstConnect) setFirstConnect(true) // set first connect to true so that the user is redirected to chat upon first connection
			})
		}
	}

	const handleConnect = (event: React.FormEvent) => {
		event.preventDefault()

		if (!checkName(username)) return

		setStatus("connect_room")
	}

	const handleConnectRoom = (event: React.FormEvent) => {
		event.preventDefault()

		if (!checkRoom(room)) return

		if (socket.connected) {
			connectGame(room)
		} else {
			socket.connect()

			socket.on("connect", () => {
				console.log("Connected handle", socket)

				if (!firstConnect) setFirstConnect(true) // set first connect to true so that the user is redirected to chat upon first connection
			})
		}
	}

	const handleBackButton = (event: React.FormEvent) => {
		event.preventDefault()

		setStatus("")
		setRoom("")
	}

	const checkName = (name: string) => {
		if (!name || name.trim().length === 0) {
			setStatus("invalid_username")
			return false
		}
		return true
	}

	const checkRoom = (name: string) => {
		if (!name || name.trim().length === 0) {
			setRoomStatus("invalid_room")
			return false
		}
		return true
	}

	const createGame = () => {
		if (status) setStatus("")
		socket.emit("create_game", { username })
	}

	const connectGame = (room: string) => {
		if (status) setStatus("")
		setUser({
			id: socket.id,
			username,
			room,
		})
		socket.emit("connect_game", { username, room })
		navigate("/chat")
	}

	useEffect(() => {
		console.log("useEffect called")

		socket.on("disconnect", () => {
			console.log("Disconnected")
		})

		socket.on("connect_error", (error: Error) => {
			console.log("connect_error", error)
			setStatus("connect_error")
		})

		// Cleanup function to remove the event listeners when the component unmounts
		return () => {
			socket.off("connect")
			socket.off("game_created")
			socket.off("connect_error")
		}
	}, [])

	useEffect(() => {
		// this will be called every time the firstConnect state changes
		console.log("firstConnect", firstConnect)
		if (firstConnect) {
			if (room) connectGame(room)
			else createGame()
		}
	}, [firstConnect])

	useEffect(() => {
		const handleGameCreated = (data: any) => {
			console.log("game_created", data)
			setRoom(data.room)
			setUser({
				id: socket.id,
				username,
				room: data.room,
			})
			navigate("/chat")
		}

		socket.on("game_created", handleGameCreated)

		// Cleanup function to remove the event listener when the component unmounts
		return () => {
			socket.off("game_created", handleGameCreated)
		}
	}, [username, user]) // Add socket and username as dependencies

	return (
		<>
			<div className="grid min-h-screen content-center gap-5 bg-gradient-to-bl from-blue-700 via-blue-800 to-slate-700 md:grid-cols-2 md:content-normal md:bg-white/90">
				<div className="flex h-full w-full flex-col items-center gap-3 p-4 text-white/90 md:justify-center md:bg-slate-500">
					<img src="/cards.svg" alt="Cartas" className="-my-8 h-32 w-32 invert" />
					<h1 className="text-6xl font-semibold">Truco</h1>
					<div className="text-center text-lg text-white/75">
						Crie uma sala ou conecte-se a uma já existente para jogar
					</div>
				</div>
				{status === "connect_room" ? (
					<form className="center flex max-w-fit flex-col gap-3 self-center justify-self-center px-4">
						{(() => {
							switch (roomStatus) {
								case "invalid_room":
									return (
										<div className="flex justify-center gap-2 rounded-md bg-red-300 p-3 text-gray-50">
											<Icon className="me-auto">error</Icon>
											<div className="me-auto">Sala inválida</div>
										</div>
									)
								case "connect_error":
									return (
										<div className="flex justify-center gap-2 rounded-md bg-red-300 p-3 text-gray-50">
											<Icon className="me-auto">error</Icon>
											<div className="me-auto">Houve um problema ao se conectar com o servidor</div>
										</div>
									)
								default:
									return null
							}
						})()}
						<label htmlFor="room" className="sr-only">
							Código da sala:
						</label>
						<input
							id="room"
							name="room"
							type="text"
							autoComplete="username"
							required
							className="placeholder:text-gray-2000 min-w-0 rounded-md border border-gray-300 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/50 sm:text-sm sm:leading-6"
							placeholder="Código da sala"
							value={room}
							onChange={(e) => setRoom(e.target.value)}
						/>
						<button
							className="rounded-md bg-green-500 px-8 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-green-600 focus:outline focus:outline-green-300"
							onClick={handleConnectRoom}
						>
							Conectar
						</button>
						<button
							type="submit"
							className="rounded-md bg-green-500 px-8 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-green-600 focus:outline focus:outline-green-300"
							onClick={handleBackButton}
						>
							Voltar
						</button>
					</form>
				) : (
					<form
						className="center flex max-w-fit flex-col gap-3 self-center justify-self-center px-4"
						onSubmit={handleConnectRoom}
					>
						{(() => {
							switch (status) {
								case "invalid_username":
									return (
										<div className="flex justify-center gap-2 rounded-md bg-red-300 p-3 text-gray-50">
											<Icon className="me-auto">error</Icon>
											<div className="me-auto">Nome inválido</div>
										</div>
									)
								case "connect_error":
									return (
										<div className="flex justify-center gap-2 rounded-md bg-red-300 p-3 text-gray-50">
											<Icon className="me-auto">error</Icon>
											<div className="me-auto">Houve um problema ao se conectar com o servidor</div>
										</div>
									)
								default:
									return null
							}
						})()}
						<div className="flex flex-col">
							<label htmlFor="name" className="sr-only">
								Nome:
							</label>
							<input
								id="name"
								name="name"
								type="text"
								autoComplete="username"
								required
								className="placeholder:text-gray-2000 min-w-0 rounded-md border border-gray-300 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/50 sm:text-sm sm:leading-6"
								placeholder="Nome"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<button
							className="rounded-md bg-green-500 px-8 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-green-600 focus:outline focus:outline-green-300"
							onClick={handleCreateRoom}
						>
							Criar Sala
						</button>
						<button
							type="submit"
							className="rounded-md bg-green-500 px-8 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-green-600 focus:outline focus:outline-green-300"
							onClick={handleConnect}
						>
							Conectar
						</button>
					</form>
				)}
			</div>
		</>
	)
}