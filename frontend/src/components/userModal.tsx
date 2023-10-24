import React, { useState } from "react"
import Icon from "@mui/material/Icon"
import { Socket } from "socket.io-client"

const UserModal = React.forwardRef<
	HTMLDialogElement,
	{ onUserChange: (name: string) => void; socket: Socket }
>((props, ref) => {
	const [name, setName] = useState("")
	const [status, setStatus] = useState("")

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value)
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		console.log(props.socket)
		if (!name || name.trim().length === 0) {
			setStatus("invalid")
			return
		} else if (!props.socket.connected) {
			setStatus("socket_disconnected")
			return
		}
		setStatus("")
		props.onUserChange(name)
	}

	return (
		<dialog className="relative" ref={ref} onCancel={(e) => e.preventDefault()}>
			<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 px-3 transition-opacity">
				<div className="relative isolate overflow-hidden rounded-md bg-gray-500 py-16 sm:py-24 lg:py-32">
					<div className="mx-auto px-6 lg:px-8">
						<div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
							<div className="flex max-w-xl items-center lg:max-w-lg">
								<h2 className="text-3xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
									Digite seu nome de usuário para começar a conversar
								</h2>
							</div>
							<div className="flex items-center">
								<form className="flex flex-grow flex-col gap-4" onSubmit={handleSubmit}>
									<div className="flex flex-grow flex-col gap-4">
										{(() => {
											switch (status) {
												case "invalid":
													return (
														<div className="flex justify-center gap-2 rounded-md bg-red-300 p-3 text-gray-50">
															<Icon className="me-auto">error</Icon>
															<div className="me-auto">Nome inválido</div>
														</div>
													)
												case "socket_disconnected":
													return (
														<div className="flex justify-center gap-2 rounded-md bg-red-300 p-3 text-gray-50">
															<Icon className="me-auto">error</Icon>
															<div className="me-auto">
																Houve um problema ao se conectar com o servidor
															</div>
														</div>
													)
												default:
													return null
											}
										})()}
										<label htmlFor="name" className="sr-only">
											Nome
										</label>
										<input
											id="name"
											name="name"
											type="text"
											autoComplete="username"
											required
											className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-gray-50 shadow-sm ring-1 ring-inset ring-white/50 placeholder:text-gray-50/50 sm:text-sm sm:leading-6"
											placeholder="Nome de usuário"
											value={name}
											onChange={handleNameChange}
										/>
									</div>
									<div>
										<button
											type="submit"
											className="w-full rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-green-600 focus:outline focus:outline-green-300"
										>
											Entrar
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div
						className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
						aria-hidden="true"
					>
						<div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#9dffb2] to-[#063847] opacity-30" />
					</div>
				</div>
			</div>
		</dialog>
	)
})

UserModal.displayName = "UserModal"
export default UserModal
