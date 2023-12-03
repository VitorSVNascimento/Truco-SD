import { createBrowserRouter } from "react-router-dom"
import Home from "../views/Home"
import ErrorPage from "../views/ErrorPage"
import Chat from "../views/Chat"
import WaitRoom from "../views/WaitRoom"
import GameRoom from "../views/GameRoom"

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/chat",
		element: <Chat />,
	},
	{
		path: "/waitRoom",
		element: <WaitRoom />,
	},
	{
		path: "/gameRoom",
		element: <GameRoom />,
	},
])

export default router
