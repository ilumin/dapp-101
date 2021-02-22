require("chai").use(require("chai-as-promised")).should();

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

    before(async () => {});

    it("creates products", async () => {
      result = await marketplace.createProduct(
        "iPhone X",
        web3.utils.toWei("1", "Ether"),
        { from: seller }
      );
      productCount = await marketplace.productCount();

      const event = result.logs[0].args;

      expect(productCount.toNumber()).equal(1);
      expect(event.id.toNumber()).equal(0);
      expect(event.name).equal("iPhone X");
      expect(event.price).equal("1000000000000000000");
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
  });
});
