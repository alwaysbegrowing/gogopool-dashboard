import { BigNumber } from "ethers";
import { Col, Divider, Typography } from "antd";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { weiValue } from "@/hooks/mounted";
import { RewardAmount } from "./Calculator";

type Props = {
  PPYCollatPercent: number;
  realPPYAmount: BigNumber;
  PLSAmount: BigNumber;
  numMinipools: number;
  PLSPriceInUsd: BigNumber;
  rewardAmounts: RewardAmount;
  PPYPriceInPLS: BigNumber;
};

export default function YourMinipoolResults({
  PPYCollatPercent,
  realPPYAmount,
  PLSAmount,
  numMinipools,
  PLSPriceInUsd,
  rewardAmounts,
  PPYPriceInPLS,
}: Props) {
  const { Paragraph, Text, Title } = Typography;

  // as of 7/13/2023
  const PLSValidatorBaseApy = parseEther("0.0798");
  const PPYMinipoolBaseApy = parseEther("0.075");

  const PPYRewardPerYearInUsd = rewardAmounts.usdReward.mul(12);
  const minipoolYearlyRewardsInPLS = PLSPriceInUsd
    .mul(PPYMinipoolBaseApy)
    .div(weiValue)
    .mul(PLSAmount)
    .div(weiValue);

  const validatorYearlyRewardsInPLS = PLSPriceInUsd
    .mul(PLSValidatorBaseApy)
    .div(weiValue)
    .mul(PLSAmount)
    .div(weiValue);

  Number(formatEther(rewardAmounts.usdReward.mul(12))).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const PLSAmountInUsd = PLSAmount.mul(PLSPriceInUsd).div(weiValue);
  const PPYAmountInUsd = realPPYAmount
    .mul(PPYPriceInPLS)
    .div(weiValue)
    .mul(PLSPriceInUsd)
    .div(weiValue);

  const inputAmount = PLSAmountInUsd.add(PPYAmountInUsd);
  const outputAmount = PPYRewardPerYearInUsd.add(minipoolYearlyRewardsInPLS);

  const PPYApy = outputAmount.mul(weiValue).div(inputAmount);

  return (
    <>
      <Title level={3}>Results</Title>
      <Col>
        <Typography>
          <Paragraph>
            <Text strong style={{ fontSize: 20, color: "#5d43ef" }}>
              With ProjectHub you will earn&nbsp;
              {Number(formatEther(PPYApy.sub(PLSValidatorBaseApy).mul(100))).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}% more APY
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
            <Text strong>{Number(formatEther(PLSAmount)).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
            } PLS</Text>. For a PPY Collateral
            Percentage of <Text strong>{PPYCollatPercent.toFixed(1)}%</Text> you are required to
            stake <Text strong>{Number(formatEther(realPPYAmount)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
            } PPY</Text>.
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>
              Operator Revenue:&emsp;
            </Text>
            <Text style={{ color: "#5d43ef", fontSize: 16 }} strong>
              PPY Minipool
            </Text>
            <br></br>
            <Text strong>{numMinipools} {" "} {numMinipools === 1 ? "Minipool" : "Minipools"}</Text> at a Collateral Percentage of&nbsp;
            <Text strong>{PPYCollatPercent.toFixed(1)}%</Text> will yield&nbsp;
            <Text strong>
              $
              {Number(formatEther(PPYRewardPerYearInUsd)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}&nbsp;
            </Text>
            a year in PPY Rewards.&nbsp;
            <Text>
              In addition you&#39;ll earn&nbsp;
              <Text strong>
                $
                {Number(formatEther(minipoolYearlyRewardsInPLS)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}&nbsp;
              </Text>
            </Text>
            from the Avalanche Network at an APY of <Text strong>{Number(formatEther(PPYMinipoolBaseApy.mul(100))).toFixed(2)}%</Text>. Which gives a total:&nbsp;
            <Text strong style={{ color: "#5d43ef" }}>
              {Number(formatEther(PPYApy.mul(100))).toLocaleString(undefined, {
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
              PLS Validator
            </Text>
            <br></br>
            <Text>
              Staking <Text strong>{
                Number(formatEther(PLSAmount)).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              } PLS</Text> on a traditional validator
              will yield&nbsp;
              <Text strong>
                $
                {Number(formatEther(validatorYearlyRewardsInPLS)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}&nbsp;
              </Text>
            </Text>
            per year at the validator total:&nbsp;
            <Text style={{ color: "#e84142" }} strong>{formatEther(PLSValidatorBaseApy.mul(100))}% APY.</Text>
          </Paragraph>
        </Typography>
      </Col>
    </>
  );
}
