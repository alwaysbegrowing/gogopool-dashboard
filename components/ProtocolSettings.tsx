import { Button, Col, Input, InputNumber, Row, Slider } from "antd";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";

export function ProtocolSettings({
  resetValues,
  setGgpPriceInAvax,
  ggpPriceInAvax,
  currentGgpPrice,
}: {
  resetValues: MouseEventHandler<HTMLAnchorElement> &
    MouseEventHandler<HTMLButtonElement>;
  ggpPriceInAvax: BigNumber;
  setGgpPriceInAvax: Dispatch<SetStateAction<BigNumber>>;
  currentGgpPrice: {
    price: BigNumber;
    timestamp: BigNumber;
  };
}) {
  return (
    <div>
      <h1>Protocol Settings</h1>
      <Button onClick={resetValues}>Reset</Button>
      <Row gutter={32}>
        <Col>
          <div>GGP {`<>`} AVAX</div>
        </Col>
        <Col>
          <Input
            type="number"
            value={+formatEther(ggpPriceInAvax.toString())}
            onChange={(e) => {
              setGgpPriceInAvax(parseEther(e.target.value || "0"));
            }}
          />
        </Col>
        <Col>
          starting price:{" "}
          {`${(+formatEther(currentGgpPrice.price.toString())).toFixed(4)}`}
        </Col>
      </Row>
    </div>
  );
}
