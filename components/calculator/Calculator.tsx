import { toWei, weiValue } from "@/hooks/mounted";
import { Col, Divider, Row, Space, Typography } from "antd";
import { BigNumber } from "ethers";
import { ChangeEvent, useEffect, useState } from "react";
import { NodeOpRewardTable } from "./NodeOpRewardTable";
import { RatioRewardsTable } from "./RatioRewardsTable";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { YourMinipool } from "./YourMinipool";
import YourMinipoolResults from "./YourMinipoolResults";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ProtocolSettings } from "./ProtocolSettings";
import { Staker } from "@/pages/calculator";

const { Paragraph, Title } = Typography;
const INVESTOR_LIST = ["0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127"];
const RETAIL_REWARD_AMOUNT = BigNumber.from("45749504487698707175523");
const INVESTOR_REWARD_AMOUNT = BigNumber.from("5083278276410967463947");

function getRewardValuesInAvaxAndUsd(reward: BigNumber, avaxPriceInUsd: BigNumber, ggpPriceInAvax: BigNumber) {
  return {
    avaxReward: reward.mul(ggpPriceInAvax).div(weiValue),
    usdReward: reward.mul(ggpPriceInAvax).mul(avaxPriceInUsd).div(weiValue).div(weiValue),
  };
}

export type RewardAmount = {
  key: string,
  collateralRatioString: string;
  collateralRatio: BigNumber;
  reward: BigNumber;
  avaxReward: BigNumber;
  usdReward: BigNumber;
  percentStake: BigNumber;
  ggpStake: BigNumber;
};

type Props = {
  stakers: Staker[];
  currentGgpPriceInAvax: BigNumber;
  avaxPriceInUsd: BigNumber;
};

export function Calculator({ stakers, currentGgpPriceInAvax, avaxPriceInUsd }: Props) {
  const isInvestorWallet = (staker: any) => {
    return INVESTOR_LIST.includes(staker.stakerAddr);
  };

  const getRewardAmount = (
    ggpStake: BigNumber,
    totalGGPStake: BigNumber,
    rewardAmount: BigNumber
  ) => {
    return ggpStake.mul(weiValue).div(totalGGPStake).mul(rewardAmount).div(weiValue);
  };

  const [avaxAmount, setAvaxAmount] = useState<BigNumber>(parseEther("1000"));
  const [numMinipools, setNumMinipools] = useState<number>(1);
  const [ggpCollatPercent, setGgpCollatPercent] = useState<number>(50);
  const [realGgpAmount, setRealGgpAmount] = useState<BigNumber>(parseEther("0"));
  const [checked, setChecked] = useState(true);
  const [ggpPriceInAvax, setGgpPriceInAvax] = useState<BigNumber>(currentGgpPriceInAvax);
  const [ggpPriceInUsd, setGgpPriceInUsd] = useState<BigNumber>(
    currentGgpPriceInAvax.mul(avaxPriceInUsd).div(weiValue)
  );

  useEffect(() => {
    if (ggpPriceInAvax.eq(0)) {
      setRealGgpAmount(BigNumber.from(0));
    } else {
      setRealGgpAmount(
        avaxAmount.div(ggpPriceInAvax).mul(parseEther((ggpCollatPercent / 100).toString()))
      );
    }
  }, [ggpPriceInAvax]);

  function handleMinipoolChange(minipools: number | null) {
    if (minipools) {
      const newAvaxAmount = parseEther((minipools * 1000).toString());
      setNumMinipools(minipools);
      setAvaxAmount(newAvaxAmount);
      setRealGgpAmount(
        newAvaxAmount.div(ggpPriceInAvax).mul(parseEther((ggpCollatPercent / 100).toString()))
      );
    }
  }

  function handlePercentChange(percent: number | null) {
    if (percent) {
      setGgpCollatPercent(percent);
      if (ggpPriceInAvax.eq(0)) {
        setRealGgpAmount(BigNumber.from(0))
        return
      }
      setRealGgpAmount(avaxAmount.div(ggpPriceInAvax).mul(parseEther((percent / 100).toString())));
    }
  }

  function handleGgpStake(stake: number | null) {
    if (stake) {
      const newGgpAmount = parseEther(stake.toString() || "0");
      setGgpCollatPercent(
        +formatEther(newGgpAmount.mul(ggpPriceInAvax).div(avaxAmount).mul(BigNumber.from(100)))
      );
      setRealGgpAmount(newGgpAmount);
    }
  }

  function handleCheck(e: CheckboxChangeEvent) {
    if (e.target.checked) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }

  // Node Operators Total Eligible GGP Staked (TEGS)
  let retailTegs = checked ? realGgpAmount : BigNumber.from("0");
  let investorTegs = BigNumber.from(0);

  const eligibleStakers = stakers
    .filter((staker) => {
      return toWei(staker.avaxValidatingHighWater) && staker.rewardsStartTime.gt(0);
    })
    .map((staker) => {
      // calculate effective ggp stake and total eligible ggp staked
      const max = staker.avaxValidatingHighWater.mul(parseEther("1.5")).div(weiValue);
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

      const collateralRatio = ggpAsAVAX.mul(weiValue).div(staker.avaxValidatingHighWater);

      return { ...staker, effectiveGGPStaked, collateralRatio };
    })
    .sort((a, b) => toWei(b.effectiveGGPStaked) - toWei(a.effectiveGGPStaked));

  // calculations that depend on Total Eligible GGP Staked (TEGS)
  let fullStakers = eligibleStakers.map((staker) => {
    let reward;
    let percentStake;
    if (isInvestorWallet(staker)) {
      reward = getRewardAmount(staker.effectiveGGPStaked, investorTegs, INVESTOR_REWARD_AMOUNT);
      percentStake = staker.effectiveGGPStaked.mul(weiValue).div(investorTegs);
    } else {
      reward = getRewardAmount(staker.effectiveGGPStaked, retailTegs, RETAIL_REWARD_AMOUNT);
      percentStake = staker.effectiveGGPStaked.mul(weiValue).div(retailTegs);
    }

    const { avaxReward, usdReward } = getRewardValuesInAvaxAndUsd(reward, avaxPriceInUsd, ggpPriceInAvax);

    return {
      ...staker,
      key: staker.stakerAddr,
      reward,
      ggpStake: staker.effectiveGGPStaked,
      avaxReward,
      usdReward,
      percentStake,
    };
  });

  const retailStakers = fullStakers.filter((staker) => !isInvestorWallet(staker));
  const investorStakers = fullStakers.filter((staker) => isInvestorWallet(staker));

  // New Node variable reward amounts
  let rewardAmounts: RewardAmount = {
    key: '1',
    collateralRatioString: ggpCollatPercent.toFixed(1).toString() + "%",
    collateralRatio: parseEther((ggpCollatPercent / 100).toFixed(5)),
    reward: BigNumber.from(0),
    ggpStake: BigNumber.from(0),
    avaxReward: BigNumber.from(0),
    usdReward: BigNumber.from(0),
    percentStake: BigNumber.from(0),
  };
  if (!ggpPriceInAvax.eq(0)) {
    rewardAmounts.ggpStake = avaxAmount.div(ggpPriceInAvax).mul(rewardAmounts.collateralRatio);
  }

  rewardAmounts.reward = getRewardAmount(rewardAmounts.ggpStake, retailTegs, RETAIL_REWARD_AMOUNT);

  const { avaxReward, usdReward } = getRewardValuesInAvaxAndUsd(
    rewardAmounts.reward,
    avaxPriceInUsd,
    ggpPriceInAvax,
  );

  rewardAmounts.avaxReward = avaxReward;
  rewardAmounts.usdReward = usdReward;
  rewardAmounts.percentStake = rewardAmounts.ggpStake.mul(weiValue).div(retailTegs);

  return (
    <>
      <Space direction="vertical">
        <Row>
          <Col xxl={4} lg={2}>
          </Col>
          <Col xxl={6} lg={8} sm={20} xs={24}>
            <Title>Minipool Rewards Calculator</Title>
            <Typography>
              <Paragraph style={{ fontSize: 18 }}>
                Estimate GGP rewards you&apos;ll recieve for running a minipool under current
                network conditions.
              </Paragraph>
            </Typography>
          </Col>
          <Col lg={2} xs={0}>
          </Col>
          <Col xxl={6} lg={8} sm={16} xs={24}>
            <ProtocolSettings
              ggpPriceInAvax={ggpPriceInAvax}
              setGgpPriceInAvax={setGgpPriceInAvax}
              currentGgpPrice={currentGgpPriceInAvax}
              avaxPriceInUsd={avaxPriceInUsd}
              ggpPriceInUsd={ggpPriceInUsd}
              setGgpPriceInUsd={setGgpPriceInUsd}
            />
          </Col>
        </Row>
        <Row>
          <Col xxl={4} lg={2}>
          </Col>
          <Col xxl={6} lg={8} sm={16} xs={24}>
            <YourMinipool
              numMinipools={numMinipools}
              avaxAmount={avaxAmount}
              ggpCollatPercent={ggpCollatPercent}
              realGgpAmount={realGgpAmount}
              handleMinipoolChange={handleMinipoolChange}
              handlePercentChange={handlePercentChange}
              handleGgpStake={handleGgpStake}
            />
          </Col>
          <Col lg={2} xs={0}>
          </Col>
          <Col xxl={8} lg={10} sm={20} xs={24}>
            <YourMinipoolResults
              ggpCollatPercent={ggpCollatPercent}
              realGgpAmount={realGgpAmount}
              avaxAmount={avaxAmount}
              numMinipools={numMinipools}
              avaxPriceInUsd={avaxPriceInUsd}
              rewardAmounts={rewardAmounts}
              ggpPriceInAvax={ggpPriceInAvax}
            />
          </Col>
        </Row>
        <Divider />
        <RatioRewardsTable rewardAmounts={rewardAmounts} />
        <Divider />
        <NodeOpRewardTable
          handleCheck={handleCheck}
          checked={checked}
          title={"Retail Node Ops"}
          details={
            "This table shows all of the Retail Staker Addresses and their effective GGP staked. It breaks down all rewards on the network in real time and gives information on rewards. Including your minipool does not affect investor rewards."
          }
          ggpStaked={retailTegs}
          stakers={retailStakers}
        />
        <Divider />
        <NodeOpRewardTable
          handleCheck={handleCheck}
          checked={checked}
          title={"Investor Node Ops"}
          details={
            "This table shows all of the Investor Staker Addresses and their effective GGP staked. Investor rewards are capped at 10% regardless of number of minipools or GGP staked."
          }
          ggpStaked={investorTegs}
          stakers={investorStakers}
        />
      </Space>
    </>
  );
}
