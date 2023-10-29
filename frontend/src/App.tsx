import "./App.css"
import { RouterProvider } from "react-router-dom"
import router from "./router/index.tsx"
// import Chat from "./views/chat"
import { socket } from "./socket"
import SocketContext from "./contexts/SocketContext"
import { UserProvider } from "./contexts/UserContext.tsx"

function App() {
	// return <Chat />
	return (
		<UserProvider>
			<SocketContext.Provider value={socket}>
				<RouterProvider router={router} />
			</SocketContext.Provider>
		</UserProvider>
	)
}

export default App
