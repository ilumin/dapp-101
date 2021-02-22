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

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address owner,
        bool purchased
    );

    constructor() public {
        name = "DApp Marketplace";
    }

    function createProduct(string memory _name, uint256 _price) public {
        require(bytes(_name).length > 0);
        require(_price > 0);

        products[productCount] = Product(
            productCount,
            _name,
            _price,
            msg.sender,
            false
        );
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
        productCount++;
    }
}
