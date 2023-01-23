const { ethers, network } = require("hardhat");

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const USDC_WHALE = "0x203520F4ec42Ea39b03F62B20e20Cf17DB5fdfA7";

async function main() {
  {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_WHALE],
    });
  }

  const whale = await ethers.getSigner(USDC_WHALE);
  const usdc = await ethers.getContractAt("IERC20", USDC);

  const accounts = await ethers.getSigners();
  const attacker = accounts[0];

  const HUNDRED_THOUSAND = ethers.utils.parseUnits("100000", 6);

  let whaleBal = await usdc.balanceOf(USDC_WHALE);
  let attackerBal = await usdc.balanceOf(attacker.address);

  console.log(
    "Initial USDC balance of whale : ",
    ethers.utils.formatUnits(whaleBal, 6)
  );

  console.log(
    "Initial USDC balance of attacker : ",
    ethers.utils.formatUnits(attackerBal, 6)
  );

  await accounts[0].sendTransaction({
    to: whale.address,
    value: ethers.utils.parseEther("50.0"), // Sends exactly 50.0 ether
  });

  await usdc.connect(whale).transfer(accounts[0].address, HUNDRED_THOUSAND);

  let newWhaleBal = await usdc.balanceOf(USDC_WHALE);
  let newAttackerBal = await usdc.balanceOf(attacker.address);

  console.log(
    "Final USDC balance of whale : ",
    ethers.utils.formatUnits(newWhaleBal, 6)
  );

  console.log(
    "Final USDC balance of attacker : ",
    ethers.utils.formatUnits(newAttackerBal, 6)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
