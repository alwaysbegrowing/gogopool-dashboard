import React from "react";
import CustomLayout from "@/components/Layout/Layout";
import { Calculator } from "@/components/calculator/Calculator";
import { useGetPPYPriceInPLS, useStakers } from "@/hooks/mounted";
import { BigNumber } from "ethers";
import axios from "axios";
import { parseEther } from "ethers/lib/utils.js";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

export interface Staker {
  PLSAssigned: BigNumber;
  PLSStaked: BigNumber;
  PLSValidating: BigNumber;
  PLSValidatingHighWater: BigNumber;
  collateralRatio: BigNumber;
  effectivePPYStaked: BigNumber;
  PPYLockedUntil: BigNumber;
  PPYRewards: BigNumber;
  PPYStake: BigNumber;
  PPYStaked: BigNumber;
  inPLS: BigNumber;
  inUsd: BigNumber;
  lastRewardsCycleCompleted: BigNumber;
  percentStake: BigNumber;
  reward: BigNumber;
  rewardsStartTime: BigNumber;
  stakerAddr: `0x${string}`;
  key: string,
  usdReward: BigNumber,
  PLSReward: BigNumber,
}

const App = () => {
  const { data: stakers, isLoading: stakersLoading } = useStakers();
  const { data: currentPPYPriceInPLS, isLoading: PPYPriceLoading } = useGetPPYPriceInPLS();
  const { data: PLSPriceInUsd, isLoading: PLSPriceLoading } = useQuery<BigNumber>({
    queryKey: ["PLS_price"],
    queryFn: () =>
      axios
        .get("https://www.jsonbateman.com/PLS_price")
        .then((res) => parseEther(res.data.price.toString()))
  });

  return (
    <CustomLayout>
      {(stakersLoading || PPYPriceLoading || PLSPriceLoading) && (<Spin />)}
      {(!stakers || !currentPPYPriceInPLS || !PLSPriceInUsd)
        ? null
        : (
          <Calculator
            stakers={stakers as Staker[]}
            currentPPYPriceInPLS={currentPPYPriceInPLS}
            PLSPriceInUsd={PLSPriceInUsd}
          />
        )}
    </CustomLayout>
  );
};

export default App;
