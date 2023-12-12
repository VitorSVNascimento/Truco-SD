import { Icon } from "@mui/material"

export default function GameRoomPlayer(props: { playerName: string; cardsNumber: any }) {
	const imageSrc = `${props.cardsNumber}-cards.svg`

	return (
		<>
			<div className="flex gap-2">
				<div className="block">
					<div className="flex items-center justify-center">
						<Icon>person</Icon>
					</div>
					<div className="text-1xl w-10 truncate text-center font-mono font-semibold antialiased sm:w-20 md:w-32 md:text-2xl lg:w-40 xl:w-60 2xl:w-72">
						{props.playerName}
					</div>
				</div>
				{props.cardsNumber > 0 && (
					<img
						className="m-1 w-7 p-0 md:w-10"
						src={imageSrc}
						alt={`Cartas do jogador ${props.playerName}.`}
					/>
				)}
			</div>
		</>
	)
}
