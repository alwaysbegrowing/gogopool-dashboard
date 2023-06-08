import {
  toWei,
  useGetGGPPriceInAVAX,
  useGetRewardsEligibilityMinSeconds,
  weiValue,
} from "@/hooks/mounted";
import { useStakers } from "@/hooks/mounted";
import { Button, Col, Input, Row, Space, Table, Typography } from "antd";
import { BigNumber } from "ethers";
import { commify, formatEther } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";

const { Title } = Typography;

export function Calculator() {
  const [ggpAmount, setGGPAmount] = useState<number>(0);
  const [avaxAmount, setAvaxAmount] = useState<BigNumber>(BigNumber.from(1000));

  const nodeOpPot = BigNumber.from("45749504487698707175523");
  const investorPot = BigNumber.from("5083278276410967463947");

  const { data: stakers } = useStakers();
  const { data: minSeconds } = useGetRewardsEligibilityMinSeconds();
  const { data: ggpPriceInAVAX } = useGetGGPPriceInAVAX();

  if (!stakers || !minSeconds || !ggpPriceInAVAX) return <Space></Space>;

  const d = new Date();
  const epoch = BigNumber.from(Math.floor(d.getTime() / 1000));

  let stakeArray: BigNumber[] = [];
  let tegs = BigNumber.from(0);
  let investorTegs = BigNumber.from(0);

  const eligibleStakers = stakers
    .filter((staker) => {
      const elapsedSeconds = epoch.sub(staker.rewardsStartTime);

      return (
        toWei(staker.avaxValidatingHighWater) && staker.rewardsStartTime.gt(0)
        // elapsedSeconds.gte(minSeconds)
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

      if (staker.stakerAddr != "0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127") {
        tegs = tegs.add(effectiveGGPStaked);
      } else {
        investorTegs = investorTegs.add(effectiveGGPStaked);
      }
      stakeArray.push(effectiveGGPStaked);

      return { ...staker, effectiveGGPStaked };
    });

  const fullStakers = eligibleStakers.map((staker) => {
    let reward;
    if (staker.stakerAddr != "0xFE5200De605AdCB6306F4CDed77f9A8D9FD47127") {
      reward = staker.effectiveGGPStaked
        .mul(weiValue)
        .div(tegs)
        .mul(nodeOpPot)
        .div(weiValue);
    } else {
      reward = staker.effectiveGGPStaked
        .mul(weiValue)
        .div(investorTegs)
        .mul(investorPot)
        .div(weiValue);
    }

    const inAvax = reward.mul(ggpPriceInAVAX.price).div(weiValue);
    const inUsd = reward.mul(ggpPriceInAVAX.price).mul(15).div(weiValue);
    const percentStake = staker.effectiveGGPStaked.mul(weiValue).div(tegs);
    return {
      ...staker,
      reward,
      ggpStake: staker.effectiveGGPStaked,
      inAvax,
      inUsd,
      percentStake,
    };
  });

  const baseColumns = [
    {
      title: "GGP Stake",
      dataIndex: "ggpStake",
      key: "ggpStake",
      render: (ggpStake: string) => (
        <>{`${commify((+formatEther(ggpStake)).toFixed(2))}`}</>
      ),
    },
    {
      title: "GGP Reward",
      dataIndex: "reward",
      key: "reward",
      render: (ggpReward: string) => (
        <>{`${commify((+formatEther(ggpReward)).toFixed(2))}`}</>
      ),
    },
    {
      title: "in AVAX",
      dataIndex: "inAvax",
      key: "inAvax",
      render: (inAvax: string) => (
        <>{`${commify((+formatEther(inAvax)).toFixed(2))}`}</>
      ),
    },
    {
      title: "in USD",
      dataIndex: "inUsd",
      key: "inUsd",
      render: (inUsd: string) => (
        <>{`$${commify((+formatEther(inUsd)).toFixed(2))}`}</>
      ),
    },
    {
      title: "percent of all stake",
      dataIndex: "percentStake",
      key: "percentStake",
      render: (percentStake: string) => (
        <>{`${(+formatEther(percentStake) * 100).toFixed(2)}%`}</>
      ),
    },
  ];

  const rewardsColumns = [
    {
      title: "Collateral Perc",
      dataIndex: "collat",
      key: "collat",
    },
    ...baseColumns,
  ];

  const stakerColumns = [
    { title: "Staker Addr", dataIndex: "stakerAddr", key: "stakerAddr" },
    ...baseColumns,
  ];

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

  rewardAmounts = rewardAmounts.map((r) => {
    const ggpStake = avaxAmount
      .mul(weiValue)
      .div(ggpPriceInAVAX.price)
      .mul(BigNumber.from(r.collatNum));

    const reward = ggpStake
      .mul(weiValue)
      .div(tegs)
      .mul(nodeOpPot)
      .div(weiValue);

    const inAvax = reward.mul(ggpPriceInAVAX.price).div(weiValue);
    const inUsd = reward.mul(ggpPriceInAVAX.price).mul(15).div(weiValue);
    const percentStake = ggpStake.mul(weiValue).div(tegs);
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
          <h2>Rewards for a new minipool</h2>
          <Table columns={rewardsColumns} dataSource={rewardAmounts} />
          <h2>Existing node ops</h2>
          <Table columns={stakerColumns} dataSource={fullStakers} />
        </Col>
      </Row>
    </Space>
  );
}
