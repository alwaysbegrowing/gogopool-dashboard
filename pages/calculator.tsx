import React from "react";
import CustomLayout from "@/components/Layout/Layout";
import { Calculator } from "@/components/calculator/Calculator";
import { useGetGGPPriceInAVAX, useGetRewardsEligibilityMinSeconds, useStakers } from "@/hooks/mounted";
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
  reward: BigNumber;
  rewardsStartTime: BigNumber;
  stakerAddr: `0x${string}`;
}

const App = () => {
  const { data: stakers, isLoading: stakersLoading } = useStakers();
  const { data: minSeconds, isLoading: minSecondsLoading } = useGetRewardsEligibilityMinSeconds();
  const { data: currentGgpPriceInAvax, isLoading: ggpPriceLoading } = useGetGGPPriceInAVAX();
  const { data: avaxPriceInUsd, isLoading: avaxPriceLoading } = useQuery<BigNumber>({
    queryKey: ["avax_price"],
    queryFn: () =>
      axios
        .get("https://www.jsonbateman.com/avax_price")
        .then((res) => parseEther(res.data.price.toString()))
  });

  return (
    <CustomLayout>
      {(stakersLoading || minSecondsLoading || ggpPriceLoading || avaxPriceLoading) && (<Spin />)}
      {(!stakers || !minSeconds || !currentGgpPriceInAvax || !avaxPriceInUsd)
        ? null
        : (
          <Calculator
            stakers={stakers as Staker[]}
            minSeconds={minSeconds}
            currentGgpPriceInAvax={currentGgpPriceInAvax}
            avaxPriceInUsd={avaxPriceInUsd}
          />
        )}
    </CustomLayout>
  );
};

export default App;
