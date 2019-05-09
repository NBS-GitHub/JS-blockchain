const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	calculateHash () {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class Blockchain {
	constructor(){
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock(){
		return new Block(0, '01/01/2019', 'Genesis block', '0');
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid() {
		for(let i = 1; i < this.chain.length; i++) {
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

// Create a blockchain
let frontEpiCoin = new Blockchain();

// Add new blocks to the blockchain
frontEpiCoin.addBlock(new Block(1, '08/01/2019', {amount: 4}));
frontEpiCoin.addBlock(new Block(2, '12/02/2019', {amount: 10}));

// Application check - displays true
console.log(`Is blockchain valid? ${frontEpiCoin.isChainValid()}`);

// Display the blockchain
console.log(JSON.stringify(frontEpiCoin, null, 3));

// Try to cheat on the blockchain, no1 - displays false
frontEpiCoin.chain[1].data = {amount: 100};
console.log(`Is blockchain valid? ${frontEpiCoin.isChainValid()}`);

// Try to cheat on the blockchain, no2 - displays false
frontEpiCoin.chain[1].hash = frontEpiCoin.chain[1].calculateHash();
console.log(`Is blockchain valid? ${frontEpiCoin.isChainValid()}`);
