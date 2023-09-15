import { toWei, weiValue } from "@/hooks/mounted";
import { Staker } from "@/pages/calculator";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils.js";

export const INVESTOR_LIST = [
  '0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127',
  '0x624c4F9E55d2D1158fD5dee555C3bc8110b1E936',
]
export const RETAIL_REWARD_AMOUNT = BigNumber.from("46303215699436471366605");
export const INVESTOR_REWARD_AMOUNT = BigNumber.from("5144801744381830151845");


/**
 * Calculate total effective GGP staked and return eligibleStakers
 * This function mutates the stakers array, adding 2 fields, effectiveGGPStaked and collateralRatio
 */
export function calculateTEGS(checked: boolean, stakers: Staker[], ggpPriceInAvax: BigNumber, realGgpAmount: BigNumber) {
  let retailTegs = checked ? realGgpAmount : BigNumber.from("0");
  let investorTegs = BigNumber.from(0);

  const eligibleStakers = stakers
    .filter((staker) => {
      return (
        toWei(staker.avaxValidatingHighWater) && staker.rewardsStartTime.gt(0)
      );
    })
    .map((staker) => {
      // calculate effective ggp stake and total eligible ggp staked
      const max = staker.avaxValidatingHighWater
        .mul(parseEther("1.5"))
        .div(weiValue);
      const ggpAsAVAX = staker.ggpStaked.mul(ggpPriceInAvax).div(weiValue);
      let effectiveGGPStaked = staker.ggpStaked;
      if (!ggpPriceInAvax.eq(parseEther("0"))) {
        effectiveGGPStaked = ggpAsAVAX.gt(max)
          ? max.mul(weiValue).div(ggpPriceInAvax)
          : staker.ggpStaked;
      }

      if (!INVESTOR_LIST.includes(staker.stakerAddr)) {
        retailTegs = retailTegs.add(effectiveGGPStaked);
      } else {
        investorTegs = investorTegs.add(effectiveGGPStaked);
      }

      const collateralRatio = ggpAsAVAX
        .mul(weiValue)
        .div(staker.avaxValidatingHighWater);

      return { ...staker, effectiveGGPStaked, collateralRatio };
    })

  return { eligibleStakers, retailTegs, investorTegs }
}

/**
 * Gets reward amount in GGP, AVAX and USD as BigNumbers
 */
export function getRewardAmounts(
  ggpStake: BigNumber,
  tegs: BigNumber,
  rewardAmount: BigNumber,
  ggpPriceInAvax: BigNumber,
  avaxPriceInUsd: BigNumber,
) {
  const ggpReward = ggpStake
    .mul(weiValue)
    .div(tegs)
    .mul(rewardAmount)
    .div(weiValue);
  const avaxReward = ggpReward
    .mul(ggpPriceInAvax)
    .div(weiValue)
  const usdReward = ggpReward
    .mul(ggpPriceInAvax)
    .mul(avaxPriceInUsd)
    .div(weiValue)
    .div(weiValue)

  return { ggpReward, avaxReward, usdReward }
};
