import { BigNumber } from "ethers";
import { Col, Divider, Typography } from "antd";
import { formatEther } from "ethers/lib/utils.js";

type Props = {
  ggpCollatPercent: number;
  realGgpAmount: BigNumber;
  avaxAmount: BigNumber;
  numMinipools: number;
};

export default function YourMinipoolResults({
  ggpCollatPercent,
  realGgpAmount,
  avaxAmount,
  numMinipools,
}: Props) {
  const { Paragraph, Text, Title } = Typography;

  return (
    <>
      <Title level={3}>Results</Title>
      <Col span={24}>
        <Typography>
          <Paragraph>
            Creating <Text strong>{numMinipools} Minipool(s)</Text> results in{" "}
            <Text strong>{formatEther(avaxAmount)} AVAX</Text> being borrowed.
            For a GGP Collateral Percentage of{" "}
            <Text strong>{ggpCollatPercent.toFixed(1)}%</Text> you are required
            to stake <Text strong>{formatEther(realGgpAmount)} GGP</Text>.
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text strong>Rewards for a New Minipool</Text>
            <br></br>
            This table shows extra information about{" "}
            <Text strong>your rewards</Text> as input into the calculator. It
            compares your newly created minipool with all of the other minipools
            on the network.
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text strong>Retail Node Ops | Investor Node Ops</Text>
            <br></br>
            These tables show all of the{" "}
            <Text strong>Retail Staker addresses</Text> and{" "}
            <Text strong>Investor Staker Addresses</Text> and their effective
            GGP staked. It breaks down all rewards on the network in real time
            and gives information on rewards. Investor rewards are capped at 10%
            regardless of number of minipools or GGP staked.
          </Paragraph>
        </Typography>
      </Col>
    </>
  );
}
