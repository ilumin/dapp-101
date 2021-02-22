require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bn")(require("bn.js")))
  .should();

const Marketplace = artifacts.require("../contracts/Marketplace.sol");

contract("Marketplace", ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await marketplace.address;

      expect(address).not.equal(0x0);
      expect(address).not.equal("");
      expect(address).not.equal(null);
      expect(address).not.equal(undefined);
    });

    it("has name", async () => {
      const name = await marketplace.name();
      expect(name).equal("DApp Marketplace");
    });
  });

  describe("products", async () => {
    let result, productCount;
    const expectedPrice = 100000000000000;

    before(async () => {
      result = await marketplace.createProduct(
        "iPhone X",
        web3.utils.toWei("0.0001", "Ether"),
        {
          from: seller,
        }
      );
    });

    it("creates products", async () => {
      productCount = await marketplace.productCount();

      const event = result.logs[0].args;

      expect(productCount.toNumber()).equal(1);
      expect(event.id.toNumber()).equal(0);
      expect(event.name).equal("iPhone X");
      expect(event.price.toNumber()).equal(expectedPrice);
      expect(event.owner).equal(seller);
      expect(event.purchased).equal(false);
    });

    it("not allow empty product name", async () => {
      marketplace.createProduct("", web3.utils.toWei("1", "Ether"), {
        from: seller,
      }).should.be.rejected;
    });

    it("not allow zero price", async () => {
      marketplace.createProduct("iPhone X", 0, {
        from: seller,
      }).should.be.rejected;
    });

    it("sells products", async () => {
      productCount = await marketplace.productCount();

      let oldSellerBalance;
      oldSellerBalance = await web3.eth.getBalance(seller);
      oldSellerBalance = new web3.utils.BN(oldSellerBalance);

      result = await marketplace.purchaseProduct(0, {
        from: buyer,
        value: web3.utils.toWei("0.0001", "Ether"),
      });

      const event = result.logs[0].args;

      expect(event.id.toNumber()).equal(0);
      expect(event.name).equal("iPhone X");
      expect(event.price.toNumber()).equal(expectedPrice);
      expect(event.owner).equal(buyer);
      expect(event.purchased).equal(true);

      let newSellerBalance;
      newSellerBalance = await web3.eth.getBalance(seller);
      newSellerBalance = new web3.utils.BN(newSellerBalance);

      let price;
      price = web3.utils.toWei("1", "Ether");
      price = new web3.utils.BN(price);

      const expectedBalance = oldSellerBalance.add(price);

      expect(newSellerBalance.toString()).equal(expectedBalance.toString());
    });
  });
});
