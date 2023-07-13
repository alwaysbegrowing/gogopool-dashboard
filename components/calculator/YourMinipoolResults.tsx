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
  const APY = inputAmount.mul(weiValue).div(outputAmount);

  return (
    <>
      <Title level={3}>Results</Title>
      <Col span={24}>
        <Typography>
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>
              GGP Minipool vs AVAX Validator
            </Text>
            <br></br>With GoGoPool you will earn{" "}
            <Text strong>
              {Number(formatEther(APY.sub(avaxValidatorBaseApy).mul(100))).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
              %
            </Text>{" "}
            more APY vs solo staking
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>
              Your Parameters
            </Text>
            <br></br>
            Creating <Text strong>{numMinipools} Minipool(s)</Text> results in{" "}
            <Text strong>{formatEther(avaxAmount)} AVAX</Text> being borrowed. For a GGP Collateral
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
            <Text strong>{ggpCollatPercent.toFixed(1)}%</Text> will yeild{" "}
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
              Staking <Text strong>{formatEther(avaxAmount)} AVAX</Text> on a traditional validator
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
