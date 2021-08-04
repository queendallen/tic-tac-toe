import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*Renders a single btn*/
/*Square is a controlled component; It receives values from Board & informs Board when its been clicked*/
/*
class Square extends React.Component {
    -Old Contructor for when Square tracked its own state-
    constructor(props){
      
      super(props);
      this.state = {
        value: null,
      };
    }

    -A Square's prop is either X, O, or null-
    render() {
      return (
        <button 
          className="square" 
          onClick={()=> this.props.onClick()} -Re-render the state when its clicked; When a btn is clicked, call the onClick() of the Square's properties (value, onClick(); See Board)-
          -Note: when you call setState on a component, it automatically updates the child components in it too-
        >
          {this.props.value}
        </button>
      );
    }
  }
*/

/*Now a function componen - Used for components that only have a rendert*/
function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


/*Renders 9 squares*/
class Board extends React.Component {
  renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]}
          onClick={()=> this.props.onClick(i)} /*Specifies Square's onClick function*/
        />
      );
  }

  render() {
      return (
        <div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
      );
  }
}

/*Renders a board*/
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) == 0,
    });
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1); //ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect
    const current = history[history.length - 1];
    const squares = current.squares.slice(); /*Copy of the squares arr. Why? Immutability*/
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  /*Note: Immutability benefits:
    (1) Keeps previous versions of data intact (can go back & reuse)
    (2) Can detect changes if you have the previous data
    (3) Helps build pure components in React - Can easily detect changes --> det when a component should re-render
  */


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares); /*const for immutable*/

    /*map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves*/
    /*map goes through the list of moves and finds if there's a move mapped to a step, else go to game start*/
    const moves = history.map((step, move) =>{
      const desc = move ?
        'Go to move # ' + move :
        'Go to game start';
      return (
        //key isn't a property; acts as a unique identifier btwn comps & their siblings
        <li key={move}> 
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status; //let for mutable
    if(winner){
      status = 'Winner: ' + winner;
    } else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
    <div className="game">
        <div className="game-board">
        <Board 
          squares={current.squares}
          onClick={(i)=>this.handleClick(i)}
        />
        </div>
        <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        </div>
    </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);  

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4 , 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}