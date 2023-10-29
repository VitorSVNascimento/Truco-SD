import React, { useState, ReactNode } from "react"
import { User } from "../types/types"

interface UserContextProps {
	user: User | null
	setUser: (user: User | null) => void
}

const UserContext = React.createContext<UserContextProps>({} as UserContextProps)

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)

	const updateUser = (newUser: User | null) => {
		setUser(newUser)
	}

	const contextValue: UserContextProps = {
		user,
		setUser: updateUser,
	}

	return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export { UserProvider, UserContext }
