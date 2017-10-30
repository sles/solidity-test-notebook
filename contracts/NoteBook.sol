pragma solidity ^0.4.4;

import './Solution.sol';

contract NoteBook {
    struct AlgorithmData {
        uint timestamp;
        uint gasPrice;
    }
    mapping(address => AlgorithmData) algorithms;
    Solution solutionContract;
    function NoteBook(address _solutionContract){
        solutionContract = Solution(_solutionContract);
    }
    function registerAlgorithm(address _algorithm, uint _timestamp) public {
        algorithms[_algorithm].timestamp = _timestamp;
    }

    function setAlgorithmGasPrice(address _algorithm, uint _gasPrice) public {
        algorithms[_algorithm].gasPrice = _gasPrice;
    }

    function sendToSolution(address _algorithm) {
        solutionContract.receiveAlgorithmData(_algorithm, algorithms[_algorithm].timestamp, algorithms[_algorithm].gasPrice);
    }
}
