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
					<div className="font-mono text-1xl text-center font-semibold antialiased md:text-2xl overflow-hidden overflow-wrap break-word">
						{props.playerName}
					</div>
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
