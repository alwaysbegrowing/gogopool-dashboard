import { BigNumber } from "ethers";
import { Col, Divider, Tooltip, Typography } from "antd";
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

  // As of 7/13/2023
  const avaxValidatorBaseApy = parseEther("0.0798");
  const ggpMinipoolBaseApy = parseEther("0.075");

  const ggpRewardPerYearInUsd = rewardAmounts.usdReward.mul(12);
  const avaxRewardsPerYearGgp = avaxPriceInUsd
    .mul(ggpMinipoolBaseApy)
    .div(weiValue)
    .mul(avaxAmount)
    .div(weiValue);

  const avaxRewardPerYearAvax = avaxPriceInUsd
    .mul(avaxValidatorBaseApy)
    .div(weiValue)
    .mul(avaxAmount)
    .div(weiValue);

  Number(formatEther(rewardAmounts.usdReward.mul(12))).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const avaxAmountInUsd = avaxAmount.mul(avaxPriceInUsd).div(weiValue);
  const ggpAmountInUsd = realGgpAmount
    .mul(ggpPriceInAvax)
    .div(weiValue)
    .mul(avaxPriceInUsd)
    .div(weiValue);

  console.log("avaxAMountInUsd", formatEther(avaxAmountInUsd));
  console.log("ggpAmotunInUsd", formatEther(ggpAmountInUsd));

  const inputAmount = avaxAmountInUsd.add(ggpAmountInUsd);

  const outputAmount = ggpRewardPerYearInUsd.add(avaxRewardsPerYearGgp);

  console.log({ inputAmount: inputAmount.toString(), outputAmount: outputAmount.toString() })
  const APY = outputAmount.mul(weiValue).div(inputAmount);

  return (
    <>
      <Title level={3}>Results</Title>
      <Col span={24}>
        <Typography>
          <Paragraph>
            <Text style={{ fontSize: 20 }}>
              With GoGoPool you will earn{" "}
              <Text strong style={{ fontSize: 20, color: "#5d43ef" }}>
                {Number(formatEther(APY.sub(avaxValidatorBaseApy).mul(100))).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}% more APY
              </Text>
              {" "}than solo staking using these parameters.
            </Text>
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>
              Your Parameters
            </Text>
            <br></br>
            Creating <Text strong>{numMinipools} Minipool(s)</Text> costs{" "}
            <Text strong>{Number(formatEther(avaxAmount)).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
            } AVAX</Text>. For a GGP Collateral
            Percentage of <Text strong>{ggpCollatPercent.toFixed(1)}%</Text> you are required to
            stake <Text strong>{formatEther(realGgpAmount)} GGP</Text>.
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>
              GGP Minipool Operator Revenue
            </Text>
            <br></br>
            <Text strong>{numMinipools} Minipool(s)</Text> at a Collateral Percentage of{" "}
            <Text strong>{ggpCollatPercent.toFixed(1)}%</Text> will yield{" "}
            <Text strong>
              $
              {Number(formatEther(ggpRewardPerYearInUsd)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
            </Text>
            a year in GGP Rewards.{" "}
            <Text>
              In addition youll earn{" "}
              <Text strong>
                $
                {Number(formatEther(avaxRewardsPerYearGgp)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
              </Text>{" "}
            </Text>
            which gives an APY of{" "}
            <Text strong>
              {Number(formatEther(APY.mul(100))).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </Text>
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>
              AVAX Validator Operator Revenue
            </Text>
            <br></br>
            <Text>
              Staking <Text strong>{
                Number(formatEther(avaxAmount)).toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })
              } AVAX</Text> on a traditional validator
              will yield{" "}
              <Text strong>
                $
                {Number(formatEther(avaxRewardPerYearAvax)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
              </Text>{" "}
              per{" "}
            </Text>
            year at the <Tooltip title="as of 7/13/2023">current*</Tooltip> validator APY of{" "}
            <Text strong>{formatEther(avaxValidatorBaseApy.mul(100))}%</Text>
          </Paragraph>
        </Typography>
      </Col>
    </>
  );
}
