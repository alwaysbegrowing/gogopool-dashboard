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
            <Text style={{ fontSize: 16 }} strong>Calculator Results</Text>
            <br></br>
            Creating <Text strong>{numMinipools} Minipool(s)</Text> results in{" "}
            <Text strong>{formatEther(avaxAmount)} AVAX</Text> being borrowed.
            For a GGP Collateral Percentage of{" "}
            <Text strong>{ggpCollatPercent.toFixed(1)}%</Text> you are required
            to stake <Text strong>{formatEther(realGgpAmount)} GGP</Text>.
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>GGP vs Normal</Text>
            <br></br>
            A Gogo Pool minipool will earn you <Text strong>Some amount of % more revenue</Text> vs solo staking :0
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>Normal Node Operator Revenue</Text>
            <br></br>
            <Text strong>{numMinipools} Validator(s)</Text> will yeild {" "}
            <Text strong>some amount of dollars per annum</Text> which gives you an APY of {" "}
            <Text strong>some APY</Text> and a return on investment of {" "}
            <Text strong>some ROI</Text>.
          </Paragraph>
          <Divider />
          <Paragraph>
            <Text style={{ fontSize: 16 }} strong>GoGo Pool Operator Revenue</Text>
            <br></br>
            <Text strong>{numMinipools} Minipool(s)</Text> at a GGP Collateral Percentage of {" "}
            <Text strong>{ggpCollatPercent.toFixed(1)} %</Text> will yeild {" "}
            <Text strong>some amount of dollars per annum</Text> which gives you an APY of {" "}
            <Text strong>some APY</Text> and a return on investment (ROI) of {" "}
            <Text strong>some ROI</Text>.
          </Paragraph>
        </Typography>
      </Col>
    </>
  );
}
