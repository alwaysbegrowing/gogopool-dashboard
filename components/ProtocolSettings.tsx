import { weiValue } from "@/hooks/mounted";
import { Col, Input, Row, Descriptions, Typography, Button, Space } from "antd";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

export function ProtocolSettings({
  ggpPriceInAvax,
  setGgpPriceInAvax,
  currentGgpPrice,
  avaxToUsd,
  ggpPriceInUsd,
  setGgpPriceInUsd,
}: {
  setGgpPriceInAvax: (b: BigNumber) => void;
  ggpPriceInAvax: BigNumber;
  currentGgpPrice: BigNumber;
  avaxToUsd: BigNumber;
  ggpPriceInUsd: BigNumber;
  setGgpPriceInUsd: (b: BigNumber) => void;
}) {
  const { Title } = Typography;
  // console.log("avaxto usd", avaxToUsd);
  // console.log(parseEther((12.1212).toString()).toString());
  // console.log(ggpPriceInAvax.toString());
  // console.log(
  //   "formatted and parsed",
  //   formatEther(parseEther((12.1212).toString()).toString())
  // );
  // console.log(
  //   "price i'm getting now",
  //   formatEther(
  //     ggpPriceInAvax.mul(parseEther((12.1212).toString())).div(weiValue)
  //   )
  // ggpPriceInAvax.mul(BigNumber.from(avaxToUsd))
  // );
  // value={(+formatEther(
  //   ggpPriceInAvax.mul(avaxToUsd).div(weiValue)
  // )).toFixed(5)}

  const resetGgpPrice = () => {
    setGgpPriceInUsd(currentGgpPrice.mul(avaxToUsd).div(weiValue));
  };

  const setBoth = (e: ChangeEvent<HTMLInputElement>) => {
    const ggpInUsd = parseEther(e.target.value || "0");
    console.log("LOOK HERE", ggpInUsd.toString());
    console.log("LOOK HERE", ggpPriceInAvax.toString());
    console.log("LOOK HERE", ggpInUsd.mul(weiValue).div(avaxToUsd).toString());
    setGgpPriceInAvax(ggpInUsd.mul(weiValue).div(avaxToUsd));
    setGgpPriceInUsd(ggpInUsd);
  };

  return (
    <>
      <Title level={4}>Manually Adjust GGP Price</Title>
      <Row gutter={[32, 16]} align="middle" justify="start">
        <Col span={24}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              addonBefore="$"
              type="number"
              value={+(+formatEther(ggpPriceInUsd)).toFixed(5)}
              onChange={setBoth}
            />
            <Button onClick={resetGgpPrice}>Reset</Button>
          </Space.Compact>
        </Col>
        {/* <Col span={20}>
          <Descriptions size="small" bordered>
            <Descriptions.Item label="Current Price ($)">
              {`${(+formatEther(currentGgpPrice.price.toString())).toFixed(5)}`}
            </Descriptions.Item>
          </Descriptions>
        </Col> */}
      </Row>
    </>
  );
}
