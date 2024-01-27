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

const { Paragraph, Title } = Typography;
const INVESTOR_LIST = ["0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127"];
const RETAIL_REWARD_AMOUNT = BigNumber.from("45749504487698707175523");
const INVESTOR_REWARD_AMOUNT = BigNumber.from("5083278276410967463947");

function getRewardValuesInPLSAndUsd(
  reward: BigNumber,
  PLSPriceInUsd: BigNumber,
  PPYPriceInPLS: BigNumber
) {
  return {
    PLSReward: reward.mul(PPYPriceInPLS).div(weiValue),
    usdReward: reward
      .mul(PPYPriceInPLS)
      .mul(PLSPriceInUsd)
      .div(weiValue)
      .div(weiValue),
  };
}

export type RewardAmount = {
  key: string;
  collateralRatioString: string;
  collateralRatio: BigNumber;
  reward: BigNumber;
  PLSReward: BigNumber;
  usdReward: BigNumber;
  percentStake: BigNumber;
  PPYStake: BigNumber;
};

type Props = {
  stakers: Staker[];
  currentPPYPriceInPLS: BigNumber;
  PLSPriceInUsd: BigNumber;
};

export function Calculator({
  stakers,
  currentPPYPriceInPLS,
  PLSPriceInUsd,
}: Props) {
  const isInvestorWallet = (staker: any) => {
    return INVESTOR_LIST.includes(staker.stakerAddr);
  };

  const getRewardAmount = (
    PPYStake: BigNumber,
    totalPPYStake: BigNumber,
    rewardAmount: BigNumber
  ) => {
    return PPYStake
      .mul(weiValue)
      .div(totalPPYStake)
      .mul(rewardAmount)
      .div(weiValue);
  };

  const [PLSAmount, setPLSAmount] = useState<BigNumber>(parseEther("1000"));
  const [numMinipools, setNumMinipools] = useState<number>(1);
  const [PPYCollatPercent, setPPYCollatPercent] = useState<number>(50);
  const [realPPYAmount, setRealPPYAmount] = useState<BigNumber>(
    parseEther("0")
  );
  const [checked, setChecked] = useState(true);
  const [PPYPriceInPLS, setPPYPriceInPLS] = useState<BigNumber>(
    currentPPYPriceInPLS
  );
  const [PPYPriceInUsd, setPPYPriceInUsd] = useState<BigNumber>(
    currentPPYPriceInPLS.mul(PLSPriceInUsd).div(weiValue)
  );

  useEffect(() => {
    if (PPYPriceInPLS.eq(0)) {
      setRealPPYAmount(BigNumber.from(0));
    } else {
      setRealPPYAmount(
        PLSAmount
          .div(PPYPriceInPLS)
          .mul(parseEther((PPYCollatPercent / 100).toString()))
      );
    }
  }, [PPYPriceInPLS, PLSAmount]);

  function handleMinipoolChange(minipools: number | null) {
    if (minipools) {
      const newPLSAmount = parseEther((minipools * 1000).toString());
      setNumMinipools(minipools);
      setPLSAmount(newPLSAmount);
      setRealPPYAmount(
        newPLSAmount
          .div(PPYPriceInPLS)
          .mul(parseEther((PPYCollatPercent / 100).toString()))
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
    if (PPYCollatPercent != percent) {
      setPPYCollatPercent(percent);
      if (PPYPriceInPLS.eq(0)) {
        setRealPPYAmount(BigNumber.from(0));
        return;
      }

      setRealPPYAmount(
        PLSAmount
          .div(PPYPriceInPLS)
          .mul(parseEther((percent / 100).toString()))
      );
    }
  }

  function handlePPYStake(stake: number | null) {
    if (stake) {
      let newPPYAmount = parseEther(stake.toString() || "0");
      let newCollatPercent =
        +formatEther(
          newPPYAmount
            .mul(PPYPriceInPLS)
            .div(PLSAmount)
            .mul(BigNumber.from(100))
        )

      // Greater than 150% collateral is not counted towards rewards in the ProjectHub protocol
      if (newCollatPercent > 150) {
        newCollatPercent = 150
        newPPYAmount = BigNumber.from(newCollatPercent).mul(PLSAmount).div(PPYPriceInPLS).div(100).mul(weiValue)
      }
      // A minipool cannot be started with less than 10% collateral
      if (newCollatPercent < 10) {
        newCollatPercent = 10
        newPPYAmount = BigNumber.from(newCollatPercent).mul(PLSAmount).div(PPYPriceInPLS).div(100).mul(weiValue)
      }
      setRealPPYAmount(newPPYAmount);
      setPPYCollatPercent(newCollatPercent);
    }
  }

  function handleCheck(e: CheckboxChangeEvent) {
    if (e.target.checked) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }

  // Node Operators Total Eligible PPY Staked (TEGS)
  let retailTegs = checked ? realPPYAmount : BigNumber.from("0");
  let investorTegs = BigNumber.from(0);

  const eligibleStakers = stakers
    .filter((staker) => {
      return (
        toWei(staker.PLSValidatingHighWater) && staker.rewardsStartTime.gt(0)
      );
    })
    .map((staker) => {
      // calculate effective PPY stake and total eligible PPY staked
      const max = staker.PLSValidatingHighWater
        .mul(parseEther("1.5"))
        .div(weiValue);
      const PPYAsPLS = staker.PPYStaked.mul(PPYPriceInPLS).div(weiValue);
      let effectivePPYStaked = staker.PPYStaked;
      if (!PPYPriceInPLS.eq(parseEther("0"))) {
        effectivePPYStaked = PPYAsPLS.gt(max)
          ? max.mul(weiValue).div(PPYPriceInPLS)
          : staker.PPYStaked;
      }

      if (!INVESTOR_LIST.includes(staker.stakerAddr)) {
        retailTegs = retailTegs.add(effectivePPYStaked);
      } else {
        investorTegs = investorTegs.add(effectivePPYStaked);
      }

      const collateralRatio = PPYAsPLS
        .mul(weiValue)
        .div(staker.PLSValidatingHighWater);

      return { ...staker, effectivePPYStaked, collateralRatio };
    })
    .sort((a, b) => toWei(b.effectivePPYStaked) - toWei(a.effectivePPYStaked));

  // calculations that depend on Total Eligible PPY Staked (TEGS)
  let fullStakers = eligibleStakers.map((staker) => {
    let reward;
    let percentStake;
    if (isInvestorWallet(staker)) {
      reward = getRewardAmount(
        staker.effectivePPYStaked,
        investorTegs,
        INVESTOR_REWARD_AMOUNT
      );
      percentStake = staker.effectivePPYStaked.mul(weiValue).div(investorTegs);
    } else {
      reward = getRewardAmount(
        staker.effectivePPYStaked,
        retailTegs,
        RETAIL_REWARD_AMOUNT
      );
      percentStake = staker.effectivePPYStaked.mul(weiValue).div(retailTegs);
    }

    const { PLSReward, usdReward } = getRewardValuesInPLSAndUsd(
      reward,
      PLSPriceInUsd,
      PPYPriceInPLS
    );

    return {
      ...staker,
      key: staker.stakerAddr,
      reward,
      PPYStake: staker.effectivePPYStaked,
      PLSReward,
      usdReward,
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
  let rewardAmounts: RewardAmount = {
    key: "1",
    collateralRatioString: PPYCollatPercent.toFixed(1).toString() + "%",
    collateralRatio: parseEther((PPYCollatPercent / 100).toFixed(5)),
    reward: BigNumber.from(0),
    PPYStake: BigNumber.from(0),
    PLSReward: BigNumber.from(0),
    usdReward: BigNumber.from(0),
    percentStake: BigNumber.from(0),
  };
  if (!PPYPriceInPLS.eq(0)) {
    rewardAmounts.PPYStake = PLSAmount
      .div(PPYPriceInPLS)
      .mul(rewardAmounts.collateralRatio);
  }

  rewardAmounts.reward = getRewardAmount(
    rewardAmounts.PPYStake,
    retailTegs,
    RETAIL_REWARD_AMOUNT
  );

  const { PLSReward, usdReward } = getRewardValuesInPLSAndUsd(
    rewardAmounts.reward,
    PLSPriceInUsd,
    PPYPriceInPLS
  );

  rewardAmounts.PLSReward = PLSReward;
  rewardAmounts.usdReward = usdReward;
  rewardAmounts.percentStake = rewardAmounts.PPYStake
    .mul(weiValue)
    .div(retailTegs);

  return (
    <>
      <Space direction="vertical">
        <Row>
          <Col xxl={4} lg={2}></Col>
          <Col xxl={6} lg={8} sm={20} xs={24}>
            <Title>Minipool Rewards Calculator</Title>
            <Typography>
              <Paragraph style={{ fontSize: 18 }}>
                Estimate PPY rewards you&apos;ll recieve for running a minipool
                under current network conditions.
              </Paragraph>
            </Typography>
          </Col>
          <Col lg={3} xs={0}></Col>
          <Col xxl={8} lg={9} sm={16} xs={24}>
            <ProtocolSettings
              PPYPriceInPLS={PPYPriceInPLS}
              setPPYPriceInPLS={setPPYPriceInPLS}
              currentPPYPrice={currentPPYPriceInPLS}
              PLSPriceInUsd={PLSPriceInUsd}
              PPYPriceInUsd={PPYPriceInUsd}
              setPPYPriceInUsd={setPPYPriceInUsd}
            />
          </Col>
        </Row>
        <Row>
          <Col xxl={4} lg={2}></Col>
          <Col xxl={7} lg={9} sm={16} xs={24}>
            <YourMinipool
              numMinipools={numMinipools}
              PLSAmount={PLSAmount}
              PPYCollatPercent={PPYCollatPercent}
              realPPYAmount={realPPYAmount}
              handleMinipoolChange={handleMinipoolChange}
              handlePercentChange={handlePercentChange}
              handlePPYStake={handlePPYStake}
            />
          </Col>
          <Col lg={2} xs={0}></Col>
          <Col xxl={8} lg={10} sm={20} xs={24}>
            <YourMinipoolResults
              PPYCollatPercent={PPYCollatPercent}
              realPPYAmount={realPPYAmount}
              PLSAmount={PLSAmount}
              numMinipools={numMinipools}
              PLSPriceInUsd={PLSPriceInUsd}
              rewardAmounts={rewardAmounts}
              PPYPriceInPLS={PPYPriceInPLS}
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
            "This table shows all of the Retail Staker Addresses and their effective PPY staked. It breaks down all rewards on the network in real time and gives information on rewards. Including your minipool does not affect investor rewards."
          }
          PPYStaked={retailTegs}
          stakers={retailStakers}
        />
        <Divider />
        <NodeOpRewardTable
          handleCheck={handleCheck}
          checked={checked}
          title={"Investor Node Ops"}
          details={
            "This table shows all of the Investor Staker Addresses and their effective PPY staked. Investor rewards are capped at 10% regardless of number of minipools or PPY staked."
          }
          PPYStaked={investorTegs}
          stakers={investorStakers}
        />
      </Space>
    </>
  );
}
