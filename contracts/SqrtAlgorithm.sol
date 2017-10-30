pragma solidity ^0.4.4;

import './Algorithm.sol';

contract SqrtAlgorithm is AbstractAlgorithm {
    function execute(uint a, uint b) constant public returns(uint){
        uint result;
        for(uint i = 0; i < 1000; i++){
            result += (a + b + a + b + a + b);
        }
        return result;
    }
}