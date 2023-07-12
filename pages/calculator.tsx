import React from "react";
import CustomLayout from "@/components/Layout/Layout";
import { Calculator } from "@/components/Calculator";
import { useStakers } from "@/hooks/mounted";
import { BigNumber } from "ethers";

export interface Staker {
  avaxAssigned: BigNumber;
  avaxStaked: BigNumber;
  avaxValidating: BigNumber;
  avaxValidatingHighWater: BigNumber;
  collateralRatio: BigNumber;
  effectiveGgpStaked: BigNumber;
  ggpLockedUntil: BigNumber;
  ggpRewards: BigNumber;
  ggpStake: BigNumber;
  ggpStaked: BigNumber;
  inAvax: BigNumber;
  inUsd: BigNumber;
  lastRewardsCycleCompleted: BigNumber;
  percentStake: BigNumber;
  reward: BigNumber;
  rewardsStartTime: BigNumber;
  stakerAddr: `0x${string}`;
}

const App = () => {
  const { data: stakers } = useStakers();
  return (
    <CustomLayout>
      <Calculator stakers={stakers} />
    </CustomLayout>
  );
};

export default App;
