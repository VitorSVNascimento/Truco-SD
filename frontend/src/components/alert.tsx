import { useState, useEffect } from "react"
import { Icon } from "@mui/material"

export default function Alert(props: { message: string; variant: string; countdown?: number }) {
	const message = props.message
	const [show, setShow] = useState(true)

	const open = () => {
		setShow(true)
	}

	const close = () => {
		setShow(false)
	}

	useEffect(() => {
		if (show) {
			setTimeout(
				() => {
					close()
				},
				props.countdown ? props.countdown * 1000 : 3000,
			)
		}
	}, [show])

	useEffect(() => {
		console.log("message", message)
		if (message) {
			open()
		}
	}, [message])

	return (
		show && (
			<div
				role="alert"
				className={`font-regular absolute end-4 top-4 flex justify-between gap-5 rounded-lg border px-4 py-4 text-base text-slate-100 shadow ${
					props.variant === "info"
						? "border-blue-600 bg-blue-500"
						: props.variant === "error"
						? "border-red-600 bg-red-500"
						: props.variant === "warning"
						? "border-yellow-600 bg-yellow-500"
						: "border-green-600 bg-green-500"
				}`}
			>
				<div>{message}</div>
				<div className="flex" role="button" onClick={close}>
					<Icon>close</Icon>
				</div>
			</div>
		)
	)
}
