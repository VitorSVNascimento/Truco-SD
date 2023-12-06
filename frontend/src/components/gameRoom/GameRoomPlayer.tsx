import { Icon } from "@mui/material"

export default function GameRoomPlayer(props: { playerName: string; cardsNumber: any }) {
	const imageSrc = `${props.cardsNumber}-cards.svg`

	return (
		<>
			<div className="flex items-center justify-center gap-2">
				<div className="block items-center justify-center">
					<div className="flex items-center justify-center">
						<Icon>person</Icon>
					</div>
					<p className="blockfont-mono text-1xl font-semibold antialiased md:text-2xl">
						{props.playerName}
					</p>
				</div>
				<img
					className="m-1 w-7 p-0 md:w-10"
					src={imageSrc}
					alt={`Cartas do jogador ${props.playerName}.`}
				/>
			</div>
		</>
	)
}
