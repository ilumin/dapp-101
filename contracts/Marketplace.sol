pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    mapping(uint256 => Product) public products;
    uint256 public productCount = 0;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "DApp Marketplace";
    }

    function createProduct(string memory _name, uint256 _price) public {
        require(bytes(_name).length > 0, "Product name cannot be blank");
        require(_price > 0, "Price should be greater than zero");

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

    function purchaseProduct(uint _id) public payable {
        Product memory _product = products[_id];
        address payable _seller = _product.owner;

        require(_product.id > 0 && _product.id <= productCount, "Invalid product");
        require(msg.value >= _product.price, "Invalid price");
        require(!_product.purchased, "Product already purchased");
        require(_seller != msg.sender, "Buyer is not sender");

        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;
        address(_seller).transfer(msg.value);
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}
