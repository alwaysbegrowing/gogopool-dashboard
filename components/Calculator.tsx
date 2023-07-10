import {
  toWei,
  useGetGGPPriceInAVAX,
  useGetRewardsEligibilityMinSeconds,
  weiValue,
} from "@/hooks/mounted";
import { useStakers } from "@/hooks/mounted";
import { Checkbox, Col, Row, Space, Typography } from "antd";
import { BigNumber } from "ethers";
import { ChangeEvent, useEffect, useState } from "react";
import { NodeOpRewardTable } from "./NodeOpRewardTable";
import { RatioRewardsTable } from "./RatioRewardsTable";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { YourMinipool } from "./YourMinipool";
import YourMinipoolResults from "./YourMinipoolResults";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const { Title } = Typography;
const INVESTOR_LIST = ["0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127"];
const RETAIL_REWARD_AMOUNT = BigNumber.from("45749504487698707175523");
const INVESTOR_REWARD_AMOUNT = BigNumber.from("5083278276410967463947");

interface Staker {
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

export function Calculator() {
  const isInvestorWallet = (staker: any) => {
    return INVESTOR_LIST.includes(staker.stakerAddr);
  };

  const getRewardAmount = (
    ggpStake: BigNumber,
    totalGGPStake: BigNumber,
    rewardAmount: BigNumber
  ): BigNumber => {
    if (totalGGPStake.eq(BigNumber.from(0))) {
      return BigNumber.from(0);
    }
    return ggpStake
      .mul(weiValue)
      .div(totalGGPStake)
      .mul(rewardAmount)
      .div(weiValue);
  };

  const [avaxAmount, setAvaxAmount] = useState<BigNumber>(parseEther("1000"));
  const [numMinipools, setNumMinipools] = useState<number>(1);
  const [ggpCollatPercent, setGgpCollatPercent] = useState<number>(50);
  const [realGgpAmount, setRealGgpAmount] = useState<BigNumber>(
    parseEther("420")
  );
  const [ggpPriceInAvax, setGgpPriceInAvax] = useState<BigNumber>(
    parseEther("0.17")
  );
  const [retailTegs, setRetailTegs] = useState<BigNumber>(BigNumber.from(0));
  const [investorTegs, setInvestorTegs] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [retailStakers, setRetailStakers] = useState<Staker[]>();
  const [investorStakers, setInvestorStakers] = useState<Staker[]>();

  const { data: stakers } = useStakers();
  const { data: minSeconds } = useGetRewardsEligibilityMinSeconds();
  const { data: currentGgpPrice } = useGetGGPPriceInAVAX();

  // This is to make everything client side render because of a hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (currentGgpPrice?.price) {
      setGgpPriceInAvax(currentGgpPrice?.price);
    }
  }, [currentGgpPrice?.price]);

  useEffect(() => {
    setRealGgpAmount(
      avaxAmount
        .div(ggpPriceInAvax)
        .mul(parseEther((ggpCollatPercent / 100).toString()))
    );
  }, [ggpPriceInAvax]);

  if (!stakers || !minSeconds || !currentGgpPrice) return null;

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
    if (percent) {
      setGgpCollatPercent(percent);
      setRealGgpAmount(
        avaxAmount
          .div(ggpPriceInAvax)
          .mul(parseEther((percent / 100).toString()))
      );
    }
  }

  function handleGgpStake(e: ChangeEvent<HTMLInputElement>) {
    const ggp = e.target.value;
    const newGgpAmount = parseEther(ggp || "0");
    setGgpCollatPercent(
      +formatEther(
        newGgpAmount
          .mul(ggpPriceInAvax)
          .div(avaxAmount)
          .mul(BigNumber.from(100))
      )
    );
    setRealGgpAmount(newGgpAmount);
  }

  function handleCheckboxChange(e: CheckboxChangeEvent) {
    if (e.target.checked) {
      setRetailTegs(retailTegs.add(realGgpAmount));
    } else {
      setRetailTegs(retailTegs.sub(realGgpAmount));
    }
  }

  function calculateEffectiveGgpStaked(staker: any): {
    effectiveGgpStaked: BigNumber;
    ggpAsAvax: BigNumber;
  } {
    const max = staker.avaxValidatingHighWater
      .mul(parseEther("1.5"))
      .div(weiValue);

    const ggpAsAvax = staker.ggpStaked.mul(ggpPriceInAvax).div(weiValue);

    let effectiveGgpStaked = staker.ggpStaked;
    if (!ggpPriceInAvax.eq(parseEther("0"))) {
      effectiveGgpStaked = ggpAsAvax.gt(max)
        ? max.mul(weiValue).div(ggpPriceInAvax)
        : staker.ggpStaked;
    }

    return { effectiveGgpStaked, ggpAsAvax };
  }

  useEffect(() => {
    let tempRetailTegs = BigNumber.from(0);
    let tempInvestorTegs = BigNumber.from(0);

    const tempEligibleStakers = stakers
      .filter((staker) => {
        return (
          toWei(staker.avaxValidatingHighWater) && staker.rewardsStartTime.gt(0)
        );
      })
      .map((staker) => {
        const { effectiveGgpStaked, ggpAsAvax } =
          calculateEffectiveGgpStaked(staker);

        if (!INVESTOR_LIST.includes(staker.stakerAddr)) {
          tempRetailTegs = tempRetailTegs.add(effectiveGgpStaked);
        } else {
          tempInvestorTegs = tempInvestorTegs.add(effectiveGgpStaked);
        }

        const collateralRatio = ggpAsAvax
          .mul(weiValue)
          .div(staker.avaxValidatingHighWater);

        return { ...staker, effectiveGgpStaked, collateralRatio };
      })
      .sort(
        (a, b) => toWei(b.effectiveGgpStaked) - toWei(a.effectiveGgpStaked)
      );

    let fullStakers = tempEligibleStakers.map((staker) => {
      let reward: BigNumber;
      let percentStake: BigNumber;
      if (isInvestorWallet(staker)) {
        reward = getRewardAmount(
          staker.effectiveGgpStaked,
          investorTegs,
          INVESTOR_REWARD_AMOUNT
        );
        percentStake = investorTegs.eq(BigNumber.from(0))
          ? BigNumber.from(0)
          : staker.effectiveGgpStaked.mul(weiValue).div(investorTegs);
      } else {
        reward = getRewardAmount(
          staker.effectiveGgpStaked,
          retailTegs,
          RETAIL_REWARD_AMOUNT
        );
        percentStake = retailTegs.eq(BigNumber.from(0))
          ? BigNumber.from(0)
          : staker.effectiveGgpStaked.mul(weiValue).div(retailTegs);
      }

      const inAvax = reward.mul(ggpPriceInAvax).div(weiValue);
      const inUsd = reward.mul(ggpPriceInAvax).mul(15).div(weiValue);
      const ggpStake: BigNumber = staker.effectiveGgpStaked;
      return {
        ...staker,
        reward,
        ggpStake,
        inAvax,
        inUsd,
        percentStake,
      };
    });

    const tempRetailStakers = fullStakers.filter(
      (staker) => !isInvestorWallet(staker)
    );

    const tempInvestorStakers = fullStakers.filter((staker: Staker) => {
      isInvestorWallet(staker);
    });

    setRetailTegs(tempRetailTegs);
    setInvestorTegs(tempInvestorTegs);
    setRetailStakers(tempRetailStakers);
    setInvestorStakers(tempInvestorStakers);
  }, [stakers, retailTegs]);

  let rewardAmounts = [
    {
      collateralRatioString: ggpCollatPercent.toFixed(1).toString() + "%",
      collateralRatio: parseEther((ggpCollatPercent / 100).toFixed(5)),
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
    const percentStake = retailTegs.eq(BigNumber.from(0))
      ? BigNumber.from(0)
      : ggpStake.mul(weiValue).div(retailTegs);
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
    <>
      {isClient && (
        <Space direction="vertical">
          <Title>Minipool Rewards Calculator</Title>
          <Row gutter={32}>
            <Col xl={8} lg={12} md={12} sm={24}>
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
            <Col xl={8} lg={12} md={12} sm={24}>
              <YourMinipoolResults
                ggpCollatPercent={ggpCollatPercent}
                realGgpAmount={realGgpAmount}
                avaxAmount={avaxAmount}
                numMinipools={numMinipools}
              />
            </Col>
          </Row>
          <RatioRewardsTable rewardAmounts={rewardAmounts} />
          <Checkbox onChange={handleCheckboxChange} />
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
      )}
    </>
  );
}
