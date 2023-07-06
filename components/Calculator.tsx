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
  const [ggpPriceInAVAX, setGgpPriceinAvax] = useState<BigNumber>(
    parseEther("0.17")
  );

  const { data: stakers } = useStakers();
  const { data: minSeconds } = useGetRewardsEligibilityMinSeconds();
  const { data: currentGgpPrice } = useGetGGPPriceInAVAX();

  useEffect(() => {
    if (currentGgpPrice?.price) {
      setGgpPriceinAvax(currentGgpPrice?.price);
    }
  }, [currentGgpPrice?.price]);

  useEffect(() => {
    setRealGgpAmount(
      avaxAmount
        .div(ggpPriceInAVAX)
        .mul(parseEther(ggpCollatPercent.toString()))
    );
  }, [ggpPriceInAVAX]);

  if (!stakers || !minSeconds || !currentGgpPrice) return null;

  const resetValues = () => {
    setAvaxAmount(parseEther("1000"));
    setGgpPriceinAvax(currentGgpPrice.price);
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

      const ggpAsAVAX = staker.ggpStaked.mul(ggpPriceInAVAX).div(weiValue);

      let effectiveGGPStaked = staker.ggpStaked;
      if (!ggpPriceInAVAX.eq(parseEther("0"))) {
        effectiveGGPStaked = ggpAsAVAX.gt(max)
          ? max.mul(weiValue).div(ggpPriceInAVAX)
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

    const inAvax = reward.mul(ggpPriceInAVAX).div(weiValue);
    const inUsd = reward.mul(ggpPriceInAVAX).mul(15).div(weiValue);
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
    let ggpStake = parseEther("0");
    if (!ggpPriceInAVAX.eq(parseEther("0"))) {
      ggpStake = avaxAmount.div(ggpPriceInAVAX).mul(r.collateralRatio);
    }

    const reward = getRewardAmount(ggpStake, retailTegs, RETAIL_REWARD_AMOUNT);

    const inAvax = reward.mul(ggpPriceInAVAX).div(weiValue);
    const inUsd = reward.mul(ggpPriceInAVAX).mul(15).div(weiValue);
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
          </Space>
          <h1>Protocol Settings</h1>
          <Button onClick={resetValues}>Reset</Button>
          <Row gutter={32}>
            <Col>
              <div>GGP {`<>`} AVAX</div>
            </Col>
            <Col>
              <Input
                type="number"
                value={+formatEther(ggpPriceInAVAX.toString())}
                onChange={(e) => {
                  setGgpPriceinAvax(parseEther(e.target.value || "0"));
                }}
              />
            </Col>
            <Col>
              starting price:{" "}
              {`${(+formatEther(currentGgpPrice.price.toString())).toFixed(4)}`}
            </Col>
          </Row>
          <h1>Your Minipool</h1>
          <Row gutter={32}>
            <Col>
              <div>Number of Minipools</div>
            </Col>
            <Col span={3}>
              <InputNumber
                value={numMinipools}
                onChange={(e) => {
                  let num = e ? e : 1;
                  setNumMinipools(num);
                  setAvaxAmount(parseEther((num * 1000).toString()));
                }}
              />
            </Col>
            <Col>
              <div>AVAX amount</div>
            </Col>
            <Col span={3}>
              <Input
                type="number"
                value={+formatEther(avaxAmount)}
                onChange={(e) => {
                  setAvaxAmount(parseEther(e.target.value || "0"));
                  // setGgpPriceinAvax(parseEther(e.target.value || "0"));
                }}
              />
            </Col>
            <Col span={12}>
              <Row gutter={32}>
                <Col span={6}>
                  <Slider
                    min={10}
                    max={150}
                    step={1}
                    marks={{
                      10: "10%",
                      150: "150%",
                    }}
                    // defaultValue={60}
                    value={ggpCollatPercent * 100}
                    onChange={(e) => {
                      setGgpCollatPercent(e / 100);
                      setRealGgpAmount(
                        avaxAmount
                          .div(ggpPriceInAVAX)
                          .mul(parseEther((e / 100).toString()))
                      );
                    }}
                  />
                </Col>

                <Col span={8}>
                  <Input
                    value={ggpCollatPercent * 100}
                    type="number"
                    onChange={(e) => {
                      setGgpCollatPercent(+e.target.value / 100);
                      setRealGgpAmount(
                        avaxAmount
                          .div(ggpPriceInAVAX)
                          .mul(parseEther((+e.target.value / 100).toString()))
                      );
                    }}
                  />
                  <div>%</div>
                </Col>
                <Col span={6}>
                  <Input
                    value={+formatEther(realGgpAmount)}
                    type="number"
                    onChange={(e) => {
                      setRealGgpAmount(parseEther(e.target.value || "0"));
                    }}
                  />
                  <div>GGP</div>
                  <Button
                    onClick={() => {
                      setGgpCollatPercent(
                        +formatEther(
                          realGgpAmount.mul(ggpPriceInAVAX).div(avaxAmount)
                        )
                      );
                    }}
                  >
                    calc
                  </Button>
                </Col>
              </Row>
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
