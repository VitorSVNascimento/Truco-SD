import { createBrowserRouter } from "react-router-dom"
import Home from "../views/home"
import Chat from "../views/chat"
import ErrorPage from "../views/errorPage"

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
])

export default router
