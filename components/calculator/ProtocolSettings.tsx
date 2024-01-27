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
  setPPYPriceInPLS,
  currentPPYPrice,
  PLSPriceInUsd,
  PPYPriceInUsd,
  setPPYPriceInUsd,
}: {
  setPPYPriceInPLS: (b: BigNumber) => void;
  PPYPriceInPLS: BigNumber;
  currentPPYPrice: BigNumber;
  PLSPriceInUsd: BigNumber;
  PPYPriceInUsd: BigNumber;
  setPPYPriceInUsd: (b: BigNumber) => void;
}) {
  const { Text } = Typography;

  const resetPPYPrice = () => {
    setPPYPriceInUsd(currentPPYPrice.mul(PLSPriceInUsd).div(weiValue));
    setPPYPriceInPLS(currentPPYPrice);
    setInputValue(
      (+formatEther(currentPPYPrice.mul(PLSPriceInUsd).div(weiValue))).toFixed(
        2
      )
    );
    setLastValidValue(
      (+formatEther(currentPPYPrice.mul(PLSPriceInUsd).div(weiValue))).toFixed(
        2
      )
    );
  };

  const [inputValue, setInputValue] = useState<string>(
    (+formatEther(PPYPriceInUsd)).toFixed(2)
  );

  const [lastValidValue, setLastValidValue] = useState<string>(
    (+formatEther(PPYPriceInUsd)).toFixed(2)
  );

  const setBoth = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]{0,2}$/;

    // If the new input value matches the pattern, update the state
    if (regex.test(value) && value !== "") {
      setInputValue(value);
      setLastValidValue(value);
      const valueAsNumber = parseFloat(value);
      const PPYInUsd = parseEther(valueAsNumber.toString() || "0");
      setPPYPriceInPLS(PPYInUsd.mul(weiValue).div(PLSPriceInUsd));
      setPPYPriceInUsd(PPYInUsd);
    } else {
      setInputValue(lastValidValue);
    }
  };

  return (
    <Card title="Manually Adjust PPY Price">
      <Row gutter={[32, 16]} align="middle" justify="start">
        <Col span={24}>
          <Space style={{ width: "100%" }}>
            <Input
              addonBefore="$"
              type="text"
              value={inputValue}
              onChange={setBoth}
            />
            <Button onClick={resetPPYPrice}>Reset</Button>
          </Space>
        </Col>
        <Col span={24}>
          <Text strong>Current Prices</Text>
          <Descriptions size="small" bordered>
            <Descriptions.Item label="PLS">
              $
              {Number(formatEther(PLSPriceInUsd)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="PPY">
              $
              {Number(
                formatEther(currentPPYPrice.mul(PLSPriceInUsd).div(weiValue))
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
