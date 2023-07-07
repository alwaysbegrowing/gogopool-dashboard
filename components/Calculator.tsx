import {
  toWei,
  useGetGGPPriceInAVAX,
  useGetRewardsEligibilityMinSeconds,
  weiValue,
} from "@/hooks/mounted";
import { useStakers } from "@/hooks/mounted";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Row,
  Slider,
  Space,
  Table,
  Typography,
} from "antd";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { NodeOpRewardTable } from "./NodeOpRewardTable";
import { RatioRewardsTable } from "./RatioRewardsTable";
import { formatEther, parseEther, parseUnits } from "ethers/lib/utils.js";
import { YourMinipool } from "./YourMinipool";
import { ProtocolSettings } from "./ProtocolSettings";

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

  const [avaxAmount, setAvaxAmount] = useState<BigNumber>(parseEther("1000"));
  const [numMinipools, setNumMinipools] = useState<number>(1);
  const [ggpCollatPercent, setGgpCollatPercent] = useState<number>(0.1);
  const [realGgpAmount, setRealGgpAmount] = useState<BigNumber>(
    parseEther("0")
  );
  const [ggpPriceInAvax, setGgpPriceInAvax] = useState<BigNumber>(
    parseEther("0.17")
  );

  const { data: stakers } = useStakers();
  const { data: minSeconds } = useGetRewardsEligibilityMinSeconds();
  const { data: currentGgpPrice } = useGetGGPPriceInAVAX();

  useEffect(() => {
    if (currentGgpPrice?.price) {
      setGgpPriceInAvax(currentGgpPrice?.price);
    }
  }, [currentGgpPrice?.price]);

  useEffect(() => {
    setRealGgpAmount(
      avaxAmount
        .div(ggpPriceInAvax)
        .mul(parseEther(ggpCollatPercent.toString()))
    );
  }, [ggpPriceInAvax]);

  if (!stakers || !minSeconds || !currentGgpPrice) return null;

  const resetValues = () => {
    setAvaxAmount(parseEther("1000"));
    setGgpPriceInAvax(currentGgpPrice.price);
    setGgpCollatPercent(0.1);
    setNumMinipools(1);
  };

  // Node Operators total eligible ggp staked
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

      const ggpAsAVAX = staker.ggpStaked.mul(ggpPriceInAvax).div(weiValue);

      let effectiveGGPStaked = staker.ggpStaked;
      if (!ggpPriceInAvax.eq(parseEther("0"))) {
        effectiveGGPStaked = ggpAsAVAX.gt(max)
          ? max.mul(weiValue).div(ggpPriceInAvax)
          : staker.ggpStaked;
      }

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

    const inAvax = reward.mul(ggpPriceInAvax).div(weiValue);
    const inUsd = reward.mul(ggpPriceInAvax).mul(15).div(weiValue);
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
      collateralRatioString: (ggpCollatPercent * 100).toString() + "%",
      collateralRatio: parseEther(ggpCollatPercent.toString()),
    },
  ];

  rewardAmounts = rewardAmounts.map((r) => {
    let ggpStake = parseEther("0");
    if (!ggpPriceInAvax.eq(parseEther("0"))) {
      ggpStake = avaxAmount.div(ggpPriceInAvax).mul(r.collateralRatio);
    }

    const reward = getRewardAmount(ggpStake, retailTegs, RETAIL_REWARD_AMOUNT);

    const inAvax = reward.mul(ggpPriceInAvax).div(weiValue);
    const inUsd = reward.mul(ggpPriceInAvax).mul(15).div(weiValue);
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
      <Space direction="vertical">
        <Title>Minipool Rewards Calculator</Title>
      </Space>
      <Row gutter={64}>
        <Col span={16}>
          <YourMinipool
            numMinipools={numMinipools}
            setNumMinipools={setNumMinipools}
            avaxAmount={avaxAmount}
            setAvaxAmount={setAvaxAmount}
            ggpCollatPercent={ggpCollatPercent}
            setGgpCollatPercent={setGgpCollatPercent}
            realGgpAmount={realGgpAmount}
            setRealGgpAmount={setRealGgpAmount}
            ggpPriceInAvax={ggpPriceInAvax}
          />
        </Col>
        <Col span={8}>
          <ProtocolSettings
            resetValues={resetValues}
            ggpPriceInAvax={ggpPriceInAvax}
            setGgpPriceInAvax={setGgpPriceInAvax}
            currentGgpPrice={currentGgpPrice}
          />
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
    </Space>
  );
}
