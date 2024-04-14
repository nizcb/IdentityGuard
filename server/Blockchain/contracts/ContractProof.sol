
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProofContract {
    struct Proof {
        uint256[] a;
        uint256[][] b;
        uint256[] c;
    }

    mapping(uint256 => Proof) private proofData;
    uint256[] public inputs;
    address private owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    constructor(uint256[] memory _a, uint256[][] memory _b, uint256[] memory _c, uint256[] memory _inputs) {
        owner = msg.sender;
        proofData[0] = Proof(_a, _b, _c); 
        inputs = _inputs;
    }

    function setProof( uint256[] memory _a, uint256[][] memory _b, uint256[] memory _c) external onlyOwner{
        proofData[0] = Proof(_a, _b, _c);
    }

    function setInputs(uint256[] memory _inputs) external onlyOwner{
        inputs = _inputs;
    }

    function getProof() external view returns (Proof memory) {
        return proofData[0];
    }

    function getInputs() external view returns (uint256[] memory) {
        return inputs;
    }
}


