import { BigNumber } from "ethers";
import { Col, Divider, Typography } from 'antd';
import { formatEther } from "ethers/lib/utils.js";

type Props = {
  ggpCollatPercent: number,
  realGgpAmount: BigNumber,
  avaxAmount: BigNumber,
  numMinipools: number,
}

export default function YourMinipoolResults({
  ggpCollatPercent,
  realGgpAmount,
  avaxAmount,
  numMinipools
}: Props) {

  const { Paragraph, Text } = Typography;

  return (
    <div>
      <h1>Results</h1>
      <Col span={24}>
        <Typography>
          <Paragraph>
            Creating <Text strong>{numMinipools} Minipool(s)</Text> results in <Text strong>{formatEther(avaxAmount)} AVAX</Text> being borrowed. In order to maintain
            a GGP Collateral Percentage of <Text strong>{ggpCollatPercent * 100}%</Text> you are required to stake <Text strong>{formatEther(realGgpAmount)} GGP</Text>.

          </Paragraph>
          <Divider />
          <Paragraph>
            In the table below there is more information about your stake in relation to your rewards.
          </Paragraph>
        </Typography>
      </Col>
    </div>
  )
}
