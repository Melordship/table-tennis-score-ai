export interface GameState {
  player1Score: number
  player2Score: number
  player1Name: string
  player2Name: string
  gameHistory: GameFrame[]
}

export interface GameFrame {
  player1Score: number
  player2Score: number
  player1Win: boolean
  player2Win: boolean
}