import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

function calculateWinner(squares) {
    // hard code lines for 3 x 3 grid, generalise later on
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    // check if any of the valid winning lines have all the same entry
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;

}

class Board extends React.Component {
    renderSquare(row,col) {
        return (
            <Square
                value={this.props.squares[row][col]}
                onClick={() => this.props.onClick(row,col)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0,0)}
                    {this.renderSquare(1,0)}
                    {this.renderSquare(2,0)}
                </div>
                <div className="board-row">
                    {this.renderSquare(0,1)}
                    {this.renderSquare(1,1)}
                    {this.renderSquare(2,1)}
                </div>
                <div className="board-row">
                    {this.renderSquare(0,2)}
                    {this.renderSquare(1,2)}
                    {this.renderSquare(2,2)}
                </div>
            </div>
        );
    }
}

class MoveList extends React.Component {
    render() {
        const history = this.props.history
        const current = this.props.currentStep
        const move2 = history.map((step, move) => {
            const desc = move ?
                'Go to move # ' + move + ' (' + history[move].lastMove + ')' :
                'Go to game start';
            if (move === current) {
                return (
                    <li key={move}>
                       <button onClick={() => this.props.moveListJumpTo(move)}><b>{desc}</b></button>
                    </li>
                )
            } else {
                return (
                    <li key={move}>
                        <button onClick={() => this.props.moveListJumpTo(move)}>{desc}</button>
                    </li>
                );
            }
        })
        return (
            move2.map(move => <div>{move}</div>)
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: [[null,null,null],[null,null,null],[null,null,null]],
                lastMove: null
            }],
            stepNumber: 0,
            xIsNext: true,

        };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        // const winner = calculateWinner(current.squares);
        let winner = null
        let status;
        status = winner ? 'Winner: ' + winner : 'Next player ' + (this.state.xIsNext ? 'X' : 'O');
        let log;
        log = current.lastMove

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(row,col) => this.handleClick(row,col)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>
                    <MoveList
                        history={this.state.history}
                        currentStep={this.state.stepNumber}
                        moveListJumpTo={(i) => this.jumpTo(i)}
                        />
                    </ol>
                </div>
                <div className="log-info">
                    <div>{log}</div>
                </div>
            </div>
        );
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleClick(row,col) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = JSON.parse(JSON.stringify(current.squares));
        if (squares[row][col]) {
            return;
        }
        squares[row][col] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMove: [row,col],
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,

        });
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
