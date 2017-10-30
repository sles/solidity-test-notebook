const Web3 = require('web3');
const contract = require("truffle-contract");
const path = require('path');
const NotebookContractJSON = require(path.join(__dirname, 'build/contracts/NoteBook.json'));
const SqrtAlgorithmContractJSON = require(path.join(__dirname, 'build/contracts/SqrtAlgorithm.json'));
const web3 = new Web3();
const provider = new Web3.providers.HttpProvider('http://localhost:8545');
web3.setProvider(provider);
const rp = require('request-promise');

async function initContract(contractJSON) {
  const _contract = contract(contractJSON);
  _contract.setProvider(web3.currentProvider);
  fixForContractProvider(_contract);
  return _contract.deployed();
}

async function run(){
  try {
    const ethGasPrice = await rp('https://api.etherscan.io/api?module=proxy&action=eth_gasPrice');
    const ethCurrency = await rp('https://api.coinmarketcap.com/v1/ticker/ethereum/');
    const gasPrice = parseInt(JSON.parse(ethGasPrice).result, 16);
    const accounts = await web3.eth.getAccounts();
    const from = {from: accounts[0]};
    const Algorithm = await initContract(SqrtAlgorithmContractJSON);
    const Notebook = await initContract(NotebookContractJSON);
    await Notebook.registerAlgorithm(Algorithm.address, Math.round(Date.now()/1000), from);
    const estimate = await Algorithm.execute.estimateGas(1, 2, from);
    const txFee = gasPrice * estimate;
    await Notebook.setAlgorithmGasPrice(Algorithm.address, txFee, from);
    await Notebook.sendToSolution(Algorithm.address, from);
    const txFeeEther = web3.utils.fromWei(txFee, "ether");
    const txFee$ = parseInt(JSON.parse(ethCurrency)[0].price_usd, 10) * txFeeEther;
    console.log("txFee in Wei");
    console.log(txFee);
    console.log("txFee in Ether");
    console.log(txFeeEther);
    console.log("txFee in $")
    console.log(txFee$)
  } catch (error) {
    console.log("error")
    console.log(error)
  }

}

function fixForContractProvider(contract) {
  if (typeof contract.currentProvider.sendAsync !== "function") {
    contract.currentProvider.sendAsync = function () {
      return contract.currentProvider.send.apply(
        contract.currentProvider,
        arguments
      );
    };
  }
}


run().catch(console.log)