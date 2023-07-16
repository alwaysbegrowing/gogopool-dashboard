import { weiValue } from "@/hooks/mounted";
import {
  Col,
  Input,
  Card,
  Row,
  Typography,
  Button,
  Space,
  Descriptions,
} from "antd";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { ChangeEvent, useState } from "react";

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
  const { Text } = Typography;

  const resetGgpPrice = () => {
    setGgpPriceInUsd(currentGgpPrice.mul(avaxPriceInUsd).div(weiValue));
    setGgpPriceInAvax(currentGgpPrice);
    setInputValue(
      (+formatEther(currentGgpPrice.mul(avaxPriceInUsd).div(weiValue))).toFixed(
        2
      )
    );
    setLastValidValue(
      (+formatEther(currentGgpPrice.mul(avaxPriceInUsd).div(weiValue))).toFixed(
        2
      )
    );
  };

  const [inputValue, setInputValue] = useState<string>(
    (+formatEther(ggpPriceInUsd)).toFixed(2)
  );

  const [lastValidValue, setLastValidValue] = useState<string>(
    (+formatEther(ggpPriceInUsd)).toFixed(2)
  );

  const setBoth = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]{0,2}$/;

    // If the new input value matches the pattern, update the state
    if (regex.test(value) && value !== "") {
      setInputValue(value);
      setLastValidValue(value);
      const valueAsNumber = parseFloat(value);
      const ggpInUsd = parseEther(valueAsNumber.toString() || "0");
      setGgpPriceInAvax(ggpInUsd.mul(weiValue).div(avaxPriceInUsd));
      setGgpPriceInUsd(ggpInUsd);
    } else {
      setInputValue(lastValidValue);
    }
  };

  return (
    <Card title="Manually Adjust GGP Price">
      <Row gutter={[32, 16]} align="middle" justify="start">
        <Col span={24}>
          <Space style={{ width: "100%" }}>
            <Input
              addonBefore="$"
              type="text"
              value={inputValue}
              onChange={setBoth}
            />
            <Button onClick={resetGgpPrice}>Reset</Button>
          </Space>
        </Col>
        <Col span={24}>
          <Text strong>Current Prices</Text>
          <Descriptions size="small" bordered>
            <Descriptions.Item label="AVAX">
              $
              {Number(formatEther(avaxPriceInUsd)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="GGP">
              $
              {Number(
                formatEther(currentGgpPrice.mul(avaxPriceInUsd).div(weiValue))
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
}
