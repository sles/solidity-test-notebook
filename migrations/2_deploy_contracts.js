var Solution = artifacts.require("./Solution.sol");
var NoteBook = artifacts.require("./NoteBook.sol");
var SqrtAlgorithm = artifacts.require("./SqrtAlgorithm.sol");

module.exports = function (deployer) {
  deployer.deploy(SqrtAlgorithm);
  deployer.deploy(Solution)
    .then(function () {
      return deployer.deploy(NoteBook, Solution.address);
    }).then(() => console.log("NoteBook.address", NoteBook.address));
};
