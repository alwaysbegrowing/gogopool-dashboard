import { toWei, weiValue } from "@/hooks/mounted";
import { Staker } from "@/pages/calculator";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils.js";

export const INVESTOR_LIST = [
  '0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127',
  '0x624c4F9E55d2D1158fD5dee555C3bc8110b1E936',
]

export const TOTAL_REWARDS = [
  BigNumber.from("72327630000000000000000"),
  BigNumber.from("72618257000000000000000"),
  BigNumber.from("72910052000000000000000"),
  BigNumber.from("73203019000000000000000"),
  BigNumber.from("73497164000000000000000"),
  BigNumber.from("73792490000000000000000"),
  BigNumber.from("74089003000000000000000"),
  BigNumber.from("74386708000000000000000"),
  BigNumber.from("74685608000000000000000"),
  BigNumber.from("74985714662440217887106"),
  BigNumber.from("75287022402968061455351"),
  BigNumber.from("75589540858828961234493"),
  BigNumber.from("75893274894921559156228"),
  BigNumber.from("76198229395692642079521"),
  BigNumber.from("76504409265215690183567"),
  BigNumber.from("76811819427269740984002"),
  BigNumber.from("77120464825418570240687"),
  BigNumber.from("77430350423090191030342"),
  BigNumber.from("77741481203656672262530"),
  BigNumber.from("78053862170514277922531"),
  BigNumber.from("78367498347163928329873"),
  BigNumber.from("78682394777291984706459"),
  BigNumber.from("78998556524851358353396"),
  BigNumber.from("79315988674142945740860"),
  BigNumber.from("79634696329897390820606"),
  BigNumber.from("79954684617357175875937"),
  BigNumber.from("80275958682359042229317"),
  BigNumber.from("80598523691416742132993"),
  BigNumber.from("80922384831804123173432"),
  BigNumber.from("81247547311638546525676"),
  BigNumber.from("81574016359964640399078"),
  BigNumber.from("81901797226838390021290"),
  BigNumber.from("82230895183411565512795"),
  BigNumber.from("82561315522016489009668"),
  BigNumber.from("82893063556251142397750"),
  BigNumber.from("83226144621064617026924"),
  BigNumber.from("83560564072842906779512"),
  BigNumber.from("83896327289495045872617"),
  BigNumber.from("84233439670539592779522"),
  BigNumber.from("84571906637191461660910"),
  BigNumber.from("84911733632449102702384"),
  BigNumber.from("85252926121182032760087"),
  BigNumber.from("85595489590218717722208"),
  BigNumber.from("85939429548434807999523"),
  BigNumber.from("86284751526841728563939"),
  BigNumber.from("86631461078675624959752"),
  BigNumber.from("86979563779486666717855"),
  BigNumber.from("87329065227228709609178"),
  BigNumber.from("87679971042349318179101"),
  BigNumber.from("88032286867880150010613"),
  BigNumber.from("88386018369527703169691"),
  BigNumber.from("88741171235764428292230"),
  BigNumber.from("89097751177920206777725"),
  BigNumber.from("89455763930274196560803"),
]


/**
 * Calculate total effective GGP staked and return eligibleStakers
 * This function mutates the stakers array, adding 2 fields, effectiveGGPStaked and collateralRatio
 */
export function calculateTEGS(checked: boolean, stakers: Staker[], ggpPriceInAvax: BigNumber, realGgpAmount: BigNumber) {
  let totalEligibleGgpStaked = checked ? realGgpAmount : BigNumber.from("0");

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

      totalEligibleGgpStaked = totalEligibleGgpStaked.add(effectiveGGPStaked);

      const collateralRatio = ggpAsAVAX
        .mul(weiValue)
        .div(staker.avaxValidatingHighWater);

      return { ...staker, effectiveGGPStaked, collateralRatio };
    })

  return { eligibleStakers, totalEligibleGgpStaked }
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
