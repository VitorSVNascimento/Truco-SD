import "./App.css"
import { RouterProvider } from "react-router-dom"
import router from "./router/index.tsx"
import { socket } from "./socket"
import SocketContext from "./contexts/SocketContext"
import { UserProvider } from "./contexts/UserContext.tsx"
import Alert from "./components/alert.tsx"

function App() {
	return (
		<UserProvider>
			<SocketContext.Provider value={socket}>
				<Alert message="Teste" variant="info" />
				<RouterProvider router={router} />
			</SocketContext.Provider>
		</UserProvider>
	)
}

export default App
