import { Col, Input, Row, Descriptions, Typography } from "antd";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { Dispatch, SetStateAction } from "react";

export function ProtocolSettings({
  setGgpPriceInAvax,
  ggpPriceInAvax,
  currentGgpPrice,
}: {
  ggpPriceInAvax: BigNumber;
  setGgpPriceInAvax: Dispatch<SetStateAction<BigNumber>>;
  currentGgpPrice: {
    price: BigNumber;
    timestamp: BigNumber;
  };
}) {
  const { Title, Paragraph } = Typography;
  return (
    <>
      <Title level={4}>Manually set the ratio of GGP to AVAX</Title>
      <Row gutter={[32, 16]} align="middle" justify="start">
        <Col span={20}>
          <Input
            addonBefore="GGP / AVAX"
            type="number"
            value={(+formatEther(ggpPriceInAvax.toString())).toFixed(5)}
            onChange={(e) => {
              setGgpPriceInAvax(parseEther(e.target.value || "0"));
            }}
          />
        </Col>
        <Col span={20}>
          <Descriptions size="small" bordered>
            <Descriptions.Item label="Starting Price">
              {`${(+formatEther(currentGgpPrice.price.toString())).toFixed(5)}`}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </>
  );
}
