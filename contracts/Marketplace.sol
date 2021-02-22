pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    mapping(uint256 => Product) public products;
    uint256 public productCount = 0;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address owner;
        bool purchased;
    }

    constructor() public {
        name = "DApp Marketplace";
    }
}
