import { useEffect, useState } from 'react';
import './StarMatch.css';

const colors = {
    available: 'lightgray',
    used: 'lightgreen',
    wrong: 'lightcoral',
    candidate: 'deepskyblue',
};

// Math science
const utils = {
    // Sum an array
    sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

    // create an array of numbers between min and max (edges included)
    range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

    // pick a random number between min and max (edges included)
    random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

    // Given an array of numbers and a max...
    // Pick a random sum (< max) from the set of all available sums in arr
    randomSumIn: (arr, max) => {
        const sets = [[]];
        const sums = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0, len = sets.length; j < len; j++) {
                const candidateSet = sets[j].concat(arr[i]);
                const candidateSum = utils.sum(candidateSet);
                if (candidateSum <= max) {
                    sets.push(candidateSet);
                    sums.push(candidateSum);
                }
            }
        }
        return sums[utils.random(0, sums.length - 1)];
    },
};

const PlayNumber = (props) => {
    // console.log('status of the number is::', props.status, props.number);

    return (
        <button
            className="number"
            style={{ backgroundColor: colors[props.status] }}
            // onClick={() => props.onNumberClick(props.number,props.status)}
            onClick={() => props.onNumberClick(props.number, props.status)}
        >
            {props.number}
        </button>

    )
}

const DisplayStar = (props) => {
    return (
        <>
            {
                utils.range(1, props.count).map((starId) => {
                    return (
                        <div key={starId} className="star" />
                    )
                })
            }
        </>
    )
}
const PlayAgain = (props) => {
    return (
        <div>
            <button className='Baton' onClick={() =>props.resetGame()}>PlayAgain</button>
            <div style={{color:props.gameStatus==='Win'?'green':'red',fontSize:'35px'}}>
                {props.gameStatus === 'Win'?'Good job':'Game Over'}
            </div>
        </div>
    )
}

const StarMatch = (props) => {
    const [star, setStar] = useState(utils.random(1, 9));
    const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
    const [candidateNums, setCandidateNums] = useState([]);
    const [secondLeft, setSecondLeft] = useState(10);
    const candidateWrong = utils.sum(candidateNums) > star;
    // const gameIsWin = availableNums.length === 0;
    // const gameIsLost = secondLeft === 0;
    const gameStatus = availableNums.length === 0 ? 'Win' : secondLeft === 0 ? 'Lost' : 'active';

    useEffect(() => {
        console.log('After html render.thi useEfect is called.');
        if (secondLeft > 0) {
            const timerID = setTimeout(() => {
                setSecondLeft(secondLeft - 1)
            }, 1000);
            return () => {
                clearTimeout(timerID);
            }
        }


    }, [secondLeft])

    const numberStatus = (number) => {
        console.log('numberstatus is:', number);
        if (!availableNums.includes(number)) {
            return 'used';
        }
        if (candidateNums.includes(number)) {
            return candidateWrong ? 'wrong' : 'candidate';
        }
        return 'available';
    }
const resetGame= ()=>{
    setCandidateNums([])
    setSecondLeft(20)
}


    const onNumberClick = (number, currentStatus) => {
        if (currentStatus === 'used') {
            return;
        }
        const newCandidateNums =
            currentStatus === 'available'
                ? candidateNums.concat(number)
                : candidateNums.filter((cn) => cn !== number);
        if (utils.sum(newCandidateNums) !== star) {
            setCandidateNums(newCandidateNums)
        } else {
            const newAvailableNums = availableNums.filter(
                (n) => !newCandidateNums.includes(n)
            );
            setStar(utils.randomSumIn(newAvailableNums, 9));
            setAvailableNums(newAvailableNums);
            setCandidateNums([]);
        }
    };

    return (
        <div className="game">
            <div className="help">
                Pick 1 or more numbers that sum to the number of stars
            </div>
            <div className="body">
                <div className="left">
                    {
                        gameStatus !== 'active' ? (
                            <PlayAgain resetGame={resetGame} gameStatus={gameStatus} />
                        ) : (
                            <DisplayStar count={star} />
                        )
                    }

                </div>
                <div className="right">
                    {
                        utils.range(1, 9).map((number) => {
                            return (
                                <PlayNumber
                                    key={number}
                                    number={number}
                                    status={numberStatus(number)}
                                    onNumberClick={onNumberClick}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <div className="timer">Time Remaining: {secondLeft}</div>
        </div>
    );
};

// ReactDOM.render(<StarMatch />, mountNode);


// *** The React 18 way:
// root.render(<StarMatch />);
export default StarMatch; 
