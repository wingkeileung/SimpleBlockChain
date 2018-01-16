const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timeStamp, data, previousHash = '') {
    this.index = index;
    this.timeStamp = timeStamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  
  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty +1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined: ' + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5;
  }

  createGenesisBlock() {
    return new Block(0, "15/01/2018", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock); //needs check for next step
  }

  chainValidation() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      
      if(currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let wingCoin = new Blockchain();

console.log("mining block 1...");
wingCoin.addBlock(new Block(1, "17/01/2018", {amount: 4}));
console.log("mining block 2...");
wingCoin.addBlock(new Block(2, "19/01/2018", {amount: 14}));

// console.log('Is blockchain valid? ' + wingCoin.chainValidation());

// wingCoin.chain[1].data = { amount: 200 };
// wingCoin.chain[1].hash = wingCoin.chain[1].calculateHash();
// console.log('Is blockchain valid? ' + wingCoin.chainValidation());

// console.log(JSON.stringify(wingCoin, null, 4));