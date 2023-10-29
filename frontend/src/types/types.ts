export interface Message {
    id: number,
    text: string,
    userId: string,
    userName: string
}

export interface User {
    id: string,
    username: string,
    room?: string
}