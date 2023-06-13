import {
  toWei,
  useGetGGPPriceInAVAX,
  useGetRewardsEligibilityMinSeconds,
  weiValue,
} from "@/hooks/mounted";
import { useStakers } from "@/hooks/mounted";
import { Col, Row, Space, Table, Typography } from "antd";
import { BigNumber } from "ethers";
import { useState } from "react";
import { NodeOpRewardTable } from "./NodeOpRewardTable";
import { RatioRewardsTable } from "./RatioRewardsTable";

const { Title } = Typography;
const INVESTOR = "0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127";
const RETAIL_REWARD_AMOUNT = BigNumber.from("45749504487698707175523");
const INVESTOR_REWARD_AMOUNT = BigNumber.from("5083278276410967463947");

export function Calculator() {
  const getStakerReward = (staker: any) => {
    if (staker.stakerAddr == INVESTOR) {
      return getReward(
        staker.effectiveGGPStaked,
        investorTegs,
        INVESTOR_REWARD_AMOUNT
      );
    }
    return getReward(
      staker.effectiveGGPStaked,
      retailTegs,
      RETAIL_REWARD_AMOUNT
    );
  };

  const getReward = (
    ggpStake: BigNumber,
    totalGGPStake: BigNumber,
    rewardAmount: BigNumber
  ) => {
    return ggpStake
      .mul(weiValue)
      .div(totalGGPStake)
      .mul(rewardAmount)
      .div(weiValue);
  };

  const getPercentStake = (staker: any) => {
    if (staker.stakerAddr == INVESTOR) {
      return staker.effectiveGGPStaked.mul(weiValue).div(investorTegs);
    }
    return staker.effectiveGGPStaked.mul(weiValue).div(retailTegs);
  };

  const [avaxAmount, setAvaxAmount] = useState<BigNumber>(BigNumber.from(1000));

  const { data: stakers } = useStakers();
  const { data: minSeconds } = useGetRewardsEligibilityMinSeconds();
  const { data: ggpPriceInAVAX } = useGetGGPPriceInAVAX();

  if (!stakers || !minSeconds || !ggpPriceInAVAX) return <Space></Space>;

  const d = new Date();
  const epoch = BigNumber.from(Math.floor(d.getTime() / 1000));

  let retailTegs = BigNumber.from(0);
  let investorTegs = BigNumber.from(0);

  const eligibleStakers = stakers
    .filter((staker) => {
      return (
        toWei(staker.avaxValidatingHighWater) && staker.rewardsStartTime.gt(0)
      );
    })
    .sort((a, b) => toWei(b.ggpStaked) - toWei(a.ggpStaked))
    .map((staker) => {
      // calculate effective ggp stake and total eligible ggp staked
      const max = staker.avaxValidatingHighWater
        .mul(BigNumber.from("1500000000000000000"))
        .div(weiValue);

      const ggpAsAVAX = staker.ggpStaked
        .mul(ggpPriceInAVAX.price)
        .div(weiValue);

      const effectiveGGPStaked = ggpAsAVAX.gt(max)
        ? max.mul(weiValue).div(ggpPriceInAVAX.price)
        : staker.ggpStaked;

      if (staker.stakerAddr != INVESTOR) {
        retailTegs = retailTegs.add(effectiveGGPStaked);
      } else {
        investorTegs = investorTegs.add(effectiveGGPStaked);
      }

      const collateralRatio = ggpAsAVAX
        .mul(weiValue)
        .div(staker.avaxValidatingHighWater);

      return { ...staker, effectiveGGPStaked, collateralRatio };
    });

  // calculations that depend on TotalEligibleGGPStaked (tegs)
  let fullStakers = eligibleStakers.map((staker) => {
    let reward = getStakerReward(staker);
    let percentStake = getPercentStake(staker);

    const inAvax = reward.mul(ggpPriceInAVAX.price).div(weiValue);
    const inUsd = reward.mul(ggpPriceInAVAX.price).mul(15).div(weiValue);
    return {
      ...staker,
      reward,
      ggpStake: staker.effectiveGGPStaked,
      inAvax,
      inUsd,
      percentStake,
    };
  });

  const retailStakers = fullStakers.filter(
    (staker) =>
      staker.stakerAddr != "0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127"
  );

  const investorStakers = fullStakers.filter(
    (staker) =>
      staker.stakerAddr == "0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127"
  );

  let rewardAmounts = [
    {
      collat: "10%",
      collatNum: BigNumber.from("100000000000000000"),
    },
    {
      collat: "50%",
      collatNum: BigNumber.from("500000000000000000"),
    },
    {
      collat: "100%",
      collatNum: BigNumber.from("1000000000000000000"),
    },
    {
      collat: "150%",
      collatNum: BigNumber.from("1500000000000000000"),
    },
  ];

  // generate data for different reward amounts
  rewardAmounts = rewardAmounts.map((r) => {
    const ggpStake = avaxAmount
      .mul(weiValue)
      .div(ggpPriceInAVAX.price)
      .mul(BigNumber.from(r.collatNum));

    const reward = getReward(ggpStake, retailTegs, RETAIL_REWARD_AMOUNT);

    const inAvax = reward.mul(ggpPriceInAVAX.price).div(weiValue);
    const inUsd = reward.mul(ggpPriceInAVAX.price).mul(15).div(weiValue);
    const percentStake = ggpStake.mul(weiValue).div(retailTegs);
    return {
      ...r,
      reward,
      ggpStake,
      inAvax,
      inUsd,
      percentStake,
    };
  });

  return (
    <Space direction="vertical">
      <Row justify={"center"}>
        <Col>
          <Space direction="vertical">
            <Title>Minipool Rewards Calculator</Title>
            <Row gutter={16}>
              {/* <Col span={20}>
                 <Input
                  placeholder="GGP Collateral"
                  type="number"
                  onChange={(e) => setGGPAmount(Number(e.target.value))}
                /> 
              </Col>
              <Col>
                <Button type="primary">Enter</Button>
              </Col> */}
            </Row>
          </Space>
          <RatioRewardsTable rewardAmounts={rewardAmounts} />
          <NodeOpRewardTable
            title={"Retail Node Ops"}
            ggpStaked={retailTegs}
            stakers={retailStakers}
          />
          <NodeOpRewardTable
            title={"Investor Node Ops"}
            ggpStaked={investorTegs}
            stakers={investorStakers}
          />
        </Col>
      </Row>
    </Space>
  );
}