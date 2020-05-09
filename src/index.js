import React from 'react'
import ReactDOM from 'react-dom'
import * as R from 'ramda'
import './index.css'

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{ color: props.winnerPoint ? '#0ff' : 'unset' }}
    >
      {props.value}
    </button>
  )
}

function Board(props) {
  return (
    <div>
      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row">
          {[0, 1, 2].map((col) => {
            const point = row * 3 + col
            return (
              <Square
                key={col}
                value={props.squares[point]}
                onClick={() => props.onClick(point)}
                winnerPoint={
                  props.winner && R.includes(point, props.winner.points)
                }
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = R.last(history)
    const squares = current.squares.slice()
    if (squares[i]) return
    if (calculateWinner(squares)) return
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: [...history, { squares, point: i }],
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const squares = current.squares
    const winner = calculateWinner(squares)
    let status
    if (winner) status = `Winner: ${winner.name}`
    else {
      const isGameOver = R.all(R.identity)(squares)
      if (!isGameOver) status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
      else status = '和棋'
    }

    const moves = this.state.history.map((m, step) => {
      let desc
      if (step === 0) desc = 'Go to game start'
      else {
        const pointRow = ((m.point / 3) >> 0) + 1
        console.log(history)
        const pointCol = (m.point % 3) + 1
        desc = `Go to move #${step} (${pointRow},${pointCol})`
      }
      return (
        <li key={step}>
          <button
            onClick={() => this.jumpTo(step)}
            style={{
              fontWeight: step === this.state.stepNumber ? 'bold' : 'unset',
              color: step === this.state.stepNumber ? '#00f' : 'unset',
            }}
          >
            {desc}
          </button>
        </li>
      )
    })
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { name: squares[a], points: lines[i] }
    }
  }
  return null
}
