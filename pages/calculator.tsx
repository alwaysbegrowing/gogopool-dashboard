import React from "react";
import CustomLayout from "@/components/Layout/Layout";
import { Calculator } from "@/components/calculator/Calculator";
import { useGetGGPPriceInAVAX, useGetRewardsCycleCount, useStakers } from "@/hooks/mounted";
import { BigNumber } from "ethers";
import axios from "axios";
import { parseEther } from "ethers/lib/utils.js";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

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
  ggpReward: BigNumber;
  rewardsStartTime: BigNumber;
  stakerAddr: `0x${string}`;
  key: string,
  usdReward: BigNumber,
  avaxReward: BigNumber,
}

const App = () => {
  const { data: stakers, isLoading: stakersLoading } = useStakers();
  const { data: currentGgpPriceInAvax, isLoading: ggpPriceLoading } = useGetGGPPriceInAVAX();
  const { data: avaxPriceInUsd, isLoading: avaxPriceLoading } = useQuery<BigNumber>({
    queryKey: ["avax_price"],
    queryFn: () =>
      axios
        .get("https://api.gogopool.com/prices")
        .then((res) => parseEther(res.data.avaxInUSD.toString()))
  });
  const { data: cycleCount } = useGetRewardsCycleCount()

  return (
    <CustomLayout>
      {(stakersLoading || ggpPriceLoading || avaxPriceLoading) && (<Spin />)}
      {(!stakers || !currentGgpPriceInAvax || !avaxPriceInUsd || !cycleCount)
        ? null
        : (
          <Calculator
            cycleCount={cycleCount}
            stakers={stakers as Staker[]}
            currentGgpPriceInAvax={currentGgpPriceInAvax}
            avaxPriceInUsd={avaxPriceInUsd}
          />
        )}
    </CustomLayout>
  );
};

export default App;
