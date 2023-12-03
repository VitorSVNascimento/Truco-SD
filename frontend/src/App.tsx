import "./App.css"
import { RouterProvider } from "react-router-dom"
import router from "./router/index.tsx"
import { useState, useEffect } from "react"
import { socket } from "./socket"
import SocketContext from "./contexts/SocketContext"
import { UserProvider } from "./contexts/UserContext.tsx"
import EventContext from "./contexts/EventContext"
import Alert from "./components/alert.tsx"
import { AlertType, EventData } from "./types/types.ts"

function App() {
	const [eventData, setEventData] = useState<EventData>({
		event: "",
		data: {},
	})

	const [alert, setAlert] = useState<AlertType>({
		message: "",
		variant: "",
	})

	const handleAlert = (alert: AlertType) => {
		setAlert(alert)
		setTimeout(() => {
			setAlert({ message: "", variant: "" })
		}, 3000)
	}

	useEffect(() => {
		switch (eventData.event) {
			case "alert":
				handleAlert(eventData.data as AlertType)
				break
		}
	}, [eventData])

	return (
		<UserProvider>
			<SocketContext.Provider value={socket}>
				<EventContext.Provider value={{ eventData, setEventData }}>
					<Alert message={alert.message} variant={alert.variant} />
					<RouterProvider router={router} />
				</EventContext.Provider>
			</SocketContext.Provider>
		</UserProvider>
	)
}

export default App
