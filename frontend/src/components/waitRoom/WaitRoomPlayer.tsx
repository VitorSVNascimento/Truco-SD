export default function WaitRoomPlayer(props: { playerName: string }) {
	return (
		<>
			<div
				className={`bg flex items-center justify-center rounded-md border border-slate-100 bg-slate-700 ${
					!props.playerName && "bg-opacity-0"
				}`}
			>
				<div className="line-clamp-1 text-center">{props.playerName || "Aguardando Player"}</div>
			</div>
		</>
	)
}
