import { BigNumber } from "ethers";
import { Col, Divider, Typography } from "antd";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { weiValue } from "@/hooks/mounted";
import { RewardAmount } from "./Calculator";

type Props = {
  ggpCollatPercent: number;
  realGgpAmount: BigNumber;
  avaxAmount: BigNumber;
  numMinipools: number;
  avaxPriceInUsd: BigNumber;
  rewardAmounts: RewardAmount;
  ggpPriceInAvax: BigNumber;
};

export default function YourMinipoolResults({
  ggpCollatPercent,
  realGgpAmount,
  avaxAmount,
  numMinipools,
  avaxPriceInUsd,
  rewardAmounts,
  ggpPriceInAvax,
}: Props) {
  const { Paragraph, Text, Title } = Typography;

  // as of 7/13/2023
  const avaxValidatorBaseApy = parseEther("0.0798");
  const ggpMinipoolBaseApy = parseEther("0.075");

  const avaxStakedInGGP = avaxAmount.mul(weiValue).div(ggpPriceInAvax)
  const ggpSpent = avaxStakedInGGP.add(realGgpAmount)
  const ggpApy = rewardAmounts.ggpReward
    .mul(weiValue)
    .div(ggpSpent)
    .mul(12)
    .add(ggpMinipoolBaseApy)

  const ggpRewardPerYearInUsd = rewardAmounts.usdReward.mul(12);
  const minipoolYearlyRewardsInAvax = avaxPriceInUsd
    .mul(ggpMinipoolBaseApy)
    .div(weiValue)
    .mul(avaxAmount)
    .div(weiValue);

  const validatorYearlyRewardsInAvax = avaxPriceInUsd
    .mul(avaxValidatorBaseApy)
    .div(weiValue)
    .mul(avaxAmount)
    .div(weiValue);

  return (
    <>
      <Title level={3}>Results</Title>
      <Col>
        <Typography>
          <Paragraph>
            <Text strong style={{ fontSize: 20, color: "#5d43ef" }}>
              With GoGoPool you will earn&nbsp;
              {Number(formatEther(ggpApy.sub(avaxValidatorBaseApy).mul(100))).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}% more APY
            </Text>
            <Text style={{ fontSize: 20 }}>
              &nbsp;than solo staking using these parameters.
            </Text>
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>
              Your Parameters
            </Text>
            <br></br>
            Creating <Text strong>{numMinipools} {" "} {numMinipools === 1 ? "Minipool" : "Minipools"}</Text> costs&nbsp;
            <Text strong>{Number(formatEther(avaxAmount)).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
            } AVAX</Text>. For a GGP Collateral
            Percentage of <Text strong>{ggpCollatPercent.toFixed(1)}%</Text> you are required to
            stake <Text strong>{Number(formatEther(realGgpAmount)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
            } GGP</Text>.
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>
              Operator Revenue:&emsp;
            </Text>
            <Text style={{ color: "#5d43ef", fontSize: 16 }} strong>
              GGP Minipool
            </Text>
            <br></br>
            <Text strong>{numMinipools} {" "} {numMinipools === 1 ? "Minipool" : "Minipools"}</Text> at a Collateral Percentage of&nbsp;
            <Text strong>{ggpCollatPercent.toFixed(1)}%</Text> will yield&nbsp;
            <Text strong>
              $
              {Number(formatEther(ggpRewardPerYearInUsd)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}&nbsp;
            </Text>
            a year in GGP Rewards.&nbsp;
            <Text>
              In addition you&#39;ll earn&nbsp;
              <Text strong>
                $
                {Number(formatEther(minipoolYearlyRewardsInAvax)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}&nbsp;
              </Text>
            </Text>
            from the Avalanche Network at an APY of <Text strong>{Number(formatEther(ggpMinipoolBaseApy.mul(100))).toFixed(2)}%</Text>. Which gives a total:&nbsp;
            <Text strong style={{ color: "#5d43ef" }}>
              {Number(formatEther(ggpApy.mul(100))).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              % APY.
            </Text>
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>
              Operator Revenue:&emsp;
            </Text>
            <Text style={{ color: "#e84142", fontSize: 16 }} strong>
              AVAX Validator
            </Text>
            <br></br>
            <Text>
              Staking <Text strong>{
                Number(formatEther(avaxAmount)).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              } AVAX</Text> on a traditional validator
              will yield&nbsp;
              <Text strong>
                $
                {Number(formatEther(validatorYearlyRewardsInAvax)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}&nbsp;
              </Text>
            </Text>
            per year at the validator total:&nbsp;
            <Text style={{ color: "#e84142" }} strong>{formatEther(avaxValidatorBaseApy.mul(100))}% APY.</Text>
          </Paragraph>
        </Typography>
      </Col>
    </>
  );
}
