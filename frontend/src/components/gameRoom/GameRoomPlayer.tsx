export default function GameRoomPlayer(props: { playerName: string; cardsNumber: any }) {
	const imageSrc = "http://127.0.0.1:8000/static/img/back.png"

	return (
		<>
			<div className="relative left-1/2">
				{Array.from({ length: props.cardsNumber }, (_, index) => (
					<div key={index}>
						<img
							className={`absolute 
														${
															(index == 0 && "z-1 left-3 top-1") ||
															(index == 1 && "z-2 left-2 top-2") ||
															(index == 2 && "z-3 left-1 top-3")
														}  
														w-10 -translate-x-1/2 transform p-0 md:w-16`}
							src={imageSrc}
							alt={`Repeated Image ${index}`}
						/>
					</div>
				))}
			</div>
		</>
	)
}
