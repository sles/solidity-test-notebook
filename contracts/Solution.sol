pragma solidity ^0.4.4;


contract Solution {
    modifier isValid(uint _timestamp, uint _gasPrice) {
        require(_timestamp > 0);
        require(_gasPrice > 0);
        _;
    }
    address[] public validAlgorithms;

    function receiveAlgorithmData(
        address _algorithm,
        uint _timestamp,
        uint _gasPrice
    )
    isValid(_timestamp, _gasPrice)
    public {
        validAlgorithms.push(_algorithm);
    }
}