import Chat from "./Chat"

export default function gameRoom() {
	return (
		<div className="flex min-h-screen flex-col items-center gap-10 bg-slate-400 p-10 text-slate-100 md:gap-28">
			
            
            <div className="fixed bottom-0 right-0">
				<div className="flex space-x-4">
					<Chat />
				</div>
			</div>
		</div>
	)
}
