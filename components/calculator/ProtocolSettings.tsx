import { weiValue } from "@/hooks/mounted";
import { Col, Input, Row, Typography, Button, Space, Descriptions } from "antd";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { ChangeEvent } from "react";

export function ProtocolSettings({
  setGgpPriceInAvax,
  currentGgpPrice,
  avaxPriceInUsd,
  ggpPriceInUsd,
  setGgpPriceInUsd,
}: {
  setGgpPriceInAvax: (b: BigNumber) => void;
  ggpPriceInAvax: BigNumber;
  currentGgpPrice: BigNumber;
  avaxPriceInUsd: BigNumber;
  ggpPriceInUsd: BigNumber;
  setGgpPriceInUsd: (b: BigNumber) => void;
}) {
  const { Title } = Typography;

  const resetGgpPrice = () => {
    setGgpPriceInUsd(currentGgpPrice.mul(avaxPriceInUsd).div(weiValue));
    setGgpPriceInAvax(currentGgpPrice);
  };

  const setBoth = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    const ggpInUsd = parseEther(value || "0");
    setGgpPriceInAvax(ggpInUsd.mul(weiValue).div(avaxPriceInUsd));
    setGgpPriceInUsd(ggpInUsd);
  }

  return (
    <>
      <Title level={4}>Manually Adjust GGP Price</Title>
      <Row gutter={[32, 16]} align="middle" justify="start">
        <Col span={24}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              addonBefore="$"
              type="number"
              value={+(+formatEther(ggpPriceInUsd)).toFixed(2)}
              onChange={setBoth}
            />
            <Button onClick={resetGgpPrice}>Reset</Button>
          </Space.Compact>
        </Col>
        <Col span={24}>
          <Descriptions size="small" bordered>
            <Descriptions.Item label="AVAX Price">
              ${Number(formatEther(avaxPriceInUsd)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="GGP Price">
              ${Number(formatEther(ggpPriceInUsd)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </>
  );
}