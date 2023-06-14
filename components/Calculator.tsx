import {
  toWei,
  useGetGGPPriceInAVAX,
  useGetRewardsEligibilityMinSeconds,
  weiValue,
} from "@/hooks/mounted";
import { useStakers } from "@/hooks/mounted";
import { Col, Input, Row, Space, Table, Typography } from "antd";
import { BigNumber } from "ethers";
import { useState } from "react";
import { NodeOpRewardTable } from "./NodeOpRewardTable";
import { RatioRewardsTable } from "./RatioRewardsTable";
import { parseEther, parseUnits } from "ethers/lib/utils.js";

const { Title } = Typography;
const INVESTOR = "0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127";
const INVESTOR_LIST = ["0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127"];
const RETAIL_REWARD_AMOUNT = BigNumber.from("45749504487698707175523");
const INVESTOR_REWARD_AMOUNT = BigNumber.from("5083278276410967463947");

export function Calculator() {
  const isInvestorWallet = (staker: any) => {
    return INVESTOR_LIST.includes(staker.stakerAddr);
  };

  const getRewardAmount = (
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

  const [avaxAmount, setAvaxAmount] = useState<BigNumber>(BigNumber.from(1000));
  const [ggpPrice, setGgpPrice] = useState<number>(0);

  const { data: stakers } = useStakers();
  const { data: minSeconds } = useGetRewardsEligibilityMinSeconds();
  const { data: ggpPriceInAVAX } = useGetGGPPriceInAVAX();

  if (!stakers || !minSeconds || !ggpPriceInAVAX) return null;

  // Node Operators
  let retailTegs = BigNumber.from(0);
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
    })
    .sort((a, b) => toWei(b.effectiveGGPStaked) - toWei(a.effectiveGGPStaked));

  // calculations that depend on TotalEligibleGGPStaked (tegs)
  let fullStakers = eligibleStakers.map((staker) => {
    let reward;
    let percentStake;
    if (isInvestorWallet(staker)) {
      reward = getRewardAmount(
        staker.effectiveGGPStaked,
        investorTegs,
        INVESTOR_REWARD_AMOUNT
      );
      percentStake = staker.effectiveGGPStaked.mul(weiValue).div(investorTegs);
    } else {
      reward = getRewardAmount(
        staker.effectiveGGPStaked,
        retailTegs,
        RETAIL_REWARD_AMOUNT
      );
      percentStake = staker.effectiveGGPStaked.mul(weiValue).div(retailTegs);
    }

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
    (staker) => !isInvestorWallet(staker)
  );

  const investorStakers = fullStakers.filter((staker) =>
    isInvestorWallet(staker)
  );

  // New Node variable reward amounts
  let rewardAmounts = [
    {
      collateralRatioString: "10%",
      collateralRatio: parseEther("0.1"),
    },
    {
      collateralRatioString: "50%",
      collateralRatio: parseEther("0.5"),
    },
    {
      collateralRatioString: "100%",
      collateralRatio: parseEther("1"),
    },
    {
      collateralRatioString: "150%",
      collateralRatio: parseEther("1.5"),
    },
  ];

  rewardAmounts = rewardAmounts.map((r) => {
    const ggpStake = avaxAmount
      .mul(weiValue)
      .div(ggpPriceInAVAX.price)
      .mul(r.collateralRatio);

    const reward = getRewardAmount(ggpStake, retailTegs, RETAIL_REWARD_AMOUNT);

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
          <h1>protocol settings</h1>
          <Row gutter={32}>
            <Col>
              <div>GGP {`<>`} USD</div>
            </Col>
            <Col>
              <Input type="number" value={ggpPrice} />
            </Col>
          </Row>
          <Row gutter={32}>
            <Col>
              <div>AVAX {`<>`} USD</div>
            </Col>
            <Col>
              <Input type="number" value={ggpPrice} />
            </Col>
          </Row>
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
