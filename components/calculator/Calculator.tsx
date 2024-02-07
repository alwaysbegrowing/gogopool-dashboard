import { toWei, weiValue } from "@/hooks/mounted";
import { Col, Divider, Row, Space, Typography } from "antd";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { NodeOpRewardTable } from "./NodeOpRewardTable";
import { RatioRewardsTable } from "./RatioRewardsTable";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { YourMinipool } from "./YourMinipool";
import YourMinipoolResults from "./YourMinipoolResults";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ProtocolSettings } from "./ProtocolSettings";
import { Staker } from "@/pages/calculator";
import { TOTAL_REWARDS, calculateTEGS, getRewardAmounts } from "./calculatorUtils";

const { Paragraph, Title } = Typography;


export type RewardAmount = {
  key: string;
  collateralRatioString: string;
  collateralRatio: BigNumber;
  ggpReward: BigNumber;
  avaxReward: BigNumber;
  usdReward: BigNumber;
  percentStake: BigNumber;
  ggpStake: BigNumber;
};

type Props = {
  stakers: Staker[];
  currentGgpPriceInAvax: BigNumber;
  avaxPriceInUsd: BigNumber;
  cycleCount: BigNumber;
};

export function Calculator({
  stakers,
  currentGgpPriceInAvax,
  avaxPriceInUsd,
  cycleCount,
}: Props) {
  const [avaxAmount, setAvaxAmount] = useState<BigNumber>(parseEther("1000"));
  const [numMinipools, setNumMinipools] = useState<number>(1);
  const [ggpCollatPercent, setGgpCollatPercent] = useState<number>(50);
  const [realGgpAmount, setRealGgpAmount] = useState<BigNumber>(
    parseEther("0")
  );
  const [checked, setChecked] = useState(true);
  const [ggpPriceInAvax, setGgpPriceInAvax] = useState<BigNumber>(
    currentGgpPriceInAvax
  );
  const [ggpPriceInUsd, setGgpPriceInUsd] = useState<BigNumber>(
    currentGgpPriceInAvax.mul(avaxPriceInUsd).div(weiValue)
  );

  console.log(cycleCount.toString())
  console.log(TOTAL_REWARDS.length)

  useEffect(() => {
    if (ggpPriceInAvax.eq(0)) {
      setRealGgpAmount(BigNumber.from(0));
    } else {
      setRealGgpAmount(
        avaxAmount
          .div(ggpPriceInAvax)
          .mul(parseEther((ggpCollatPercent / 100).toString()))
      );
    }
  }, [ggpPriceInAvax, avaxAmount]);

  const totalRewards = TOTAL_REWARDS[Number(cycleCount)].mul(7).div(10)
  console.log(formatEther(totalRewards))

  function handleMinipoolChange(minipools: number | null) {
    if (minipools) {
      const newAvaxAmount = parseEther((minipools * 1000).toString());
      setNumMinipools(minipools);
      setAvaxAmount(newAvaxAmount);
      setRealGgpAmount(
        newAvaxAmount
          .div(ggpPriceInAvax)
          .mul(parseEther((ggpCollatPercent / 100).toString()))
      );
    }
  }

  function handlePercentChange(percent: number | null) {
    if (!percent) return;
    if (percent < 10) {
      percent = 10;
    }
    if (percent > 150) {
      percent = 150;
    }
    if (ggpCollatPercent != percent) {
      setGgpCollatPercent(percent);
      if (ggpPriceInAvax.eq(0)) {
        setRealGgpAmount(BigNumber.from(0));
        return;
      }

      setRealGgpAmount(
        avaxAmount
          .div(ggpPriceInAvax)
          .mul(parseEther((percent / 100).toString()))
      );
    }
  }

  function handleGgpStake(stake: number | null) {
    if (stake) {
      let newGgpAmount = parseEther(stake.toString() || "0");
      let newCollatPercent =
        +formatEther(
          newGgpAmount
            .mul(ggpPriceInAvax)
            .div(avaxAmount)
            .mul(BigNumber.from(100))
        )

      // Greater than 150% collateral is not counted towards rewards in the gogopool protocol
      if (newCollatPercent > 150) {
        newCollatPercent = 150
        newGgpAmount = BigNumber.from(newCollatPercent).mul(avaxAmount).div(ggpPriceInAvax).div(100).mul(weiValue)
      }
      // A minipool cannot be started with less than 10% collateral
      if (newCollatPercent < 10) {
        newCollatPercent = 10
        newGgpAmount = BigNumber.from(newCollatPercent).mul(avaxAmount).div(ggpPriceInAvax).div(100).mul(weiValue)
      }
      setRealGgpAmount(newGgpAmount);
      setGgpCollatPercent(newCollatPercent);
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
  const { eligibleStakers, totalEligibleGgpStaked } = calculateTEGS(checked, stakers, ggpPriceInAvax, realGgpAmount)
  eligibleStakers.sort((a, b) => toWei(b.effectiveGGPStaked) - toWei(a.effectiveGGPStaked));

  // calculations that depend on Total Eligible GGP Staked (TEGS)
  let fullStakers = eligibleStakers.map((staker) => {
    let rewardAmount = totalRewards;
    let percentStake = staker.effectiveGGPStaked.mul(weiValue).div(totalEligibleGgpStaked);

    const { ggpReward, avaxReward, usdReward } = getRewardAmounts(
      staker.effectiveGGPStaked,
      totalEligibleGgpStaked,
      rewardAmount,
      ggpPriceInAvax,
      avaxPriceInUsd
    );

    return {
      ...staker,
      key: staker.stakerAddr,
      ggpReward,
      ggpStake: staker.effectiveGGPStaked,
      avaxReward,
      usdReward,
      percentStake,
    };
  });

  // New Node variable reward amounts
  let rewardAmounts: RewardAmount = {
    key: "1",
    collateralRatioString: ggpCollatPercent.toFixed(1).toString() + "%",
    collateralRatio: parseEther((ggpCollatPercent / 100).toFixed(5)),
    ggpReward: BigNumber.from(0),
    ggpStake: BigNumber.from(0),
    avaxReward: BigNumber.from(0),
    usdReward: BigNumber.from(0),
    percentStake: BigNumber.from(0),
  };
  if (!ggpPriceInAvax.eq(0)) {
    rewardAmounts.ggpStake = avaxAmount
      .div(ggpPriceInAvax)
      .mul(rewardAmounts.collateralRatio);
  }

  const { ggpReward, avaxReward, usdReward } = getRewardAmounts(
    rewardAmounts.ggpStake,
    totalEligibleGgpStaked,
    totalRewards,
    ggpPriceInAvax,
    avaxPriceInUsd
  );

  rewardAmounts.ggpReward = ggpReward;
  rewardAmounts.avaxReward = avaxReward;
  rewardAmounts.usdReward = usdReward;
  rewardAmounts.percentStake = rewardAmounts.ggpStake
    .mul(weiValue)
    .div(totalEligibleGgpStaked);

  return (
    <>
      <Space direction="vertical">
        <Row>
          <Col xxl={4} lg={2}></Col>
          <Col xxl={6} lg={8} sm={20} xs={24}>
            <Title>Minipool Rewards Calculator</Title>
            <Typography>
              <Paragraph style={{ fontSize: 18 }}>
                Estimate GGP rewards you&apos;ll recieve for running a minipool
                under current network conditions.
              </Paragraph>
            </Typography>
          </Col>
          <Col lg={3} xs={0}></Col>
          <Col xxl={8} lg={9} sm={16} xs={24}>
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
          <Col xxl={4} lg={2}></Col>
          <Col xxl={7} lg={9} sm={16} xs={24}>
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
          <Col lg={2} xs={0}></Col>
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
          ggpStaked={totalEligibleGgpStaked}
          stakers={fullStakers}
        />
        <Divider />
      </Space>
    </>
  );
}
