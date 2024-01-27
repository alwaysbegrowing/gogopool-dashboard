import { InfoCircleOutlined, LinkOutlined } from "@ant-design/icons";
import {
  Col,
  Divider,
  InputNumber,
  Row,
  Slider,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

export function YourMinipool({
  numMinipools,
  PLSAmount,
  PPYCollatPercent,
  realPPYAmount,
  handleMinipoolChange,
  handlePercentChange,
  handlePPYStake,
}: {
  numMinipools: number;
  PLSAmount: BigNumber;
  PPYCollatPercent: number;
  realPPYAmount: BigNumber;
  handleMinipoolChange: (minipools: number | null) => void;
  handlePercentChange: (percent: number | null) => void;
  handlePPYStake: (stake: number | null) => void;
}) {
  const { Text, Title } = Typography;

  return (
    <>
      <Title level={3}>Your Minipool</Title>
      {/*PLS*/}
      <Row gutter={[0, 8]} justify="start">
        <Row>
          <Col span={10}>
            <Space direction="vertical">
              <Space>
                <Text strong>№ of Minipools</Text>
                <Tooltip title="Number of Minipools You Wish to Create">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
              <InputNumber
                style={{ width: "100%" }}
                addonAfter={numMinipools === 1 ? "Minipool" : "Minipools"}
                value={numMinipools}
                onChange={handleMinipoolChange}
              />
            </Space>
          </Col>
          <Col span={4}>
            <Tooltip title="The number of minipools and amount of PLS staked is linked together.">
              <LinkOutlined
                style={{
                  marginTop: "32px",
                  fontSize: "26px",
                  color: "#696969",
                  display: "block",
                }}
                rotate={45}
                twoToneColor={"primary"}
              />
            </Tooltip>
          </Col>
          <Col span={10}>
            <Space direction="vertical">
              <Space>
                <Text strong>PLS Staked</Text>
                <Tooltip title="Always 1000 PLS per minipool">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
              <InputNumber
                style={{ width: "100%" }}
                addonAfter="PLS"
                value={Number(formatEther(PLSAmount))}
                disabled
              />
            </Space>
          </Col>
        </Row>

        <Col span={24}>
          <Divider />
        </Col>
        {/*PPY*/}
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <Text strong>PPY Collateral Percentage</Text>
              <Tooltip
                title={`(PPY Stake * PPY price) ÷ (PLS Stake * PLS Price) × 100`}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
            <InputNumber
              style={{ width: "100%" }}
              value={Number(PPYCollatPercent.toFixed(1))}
              type="number"
              addonAfter={"%"}
              onChange={handlePercentChange}
            />
          </Space>
        </Col>
        <Col span={1}></Col>
        <Col span={21}>
          <Slider
            min={10}
            style={{ width: "100%" }}
            max={150}
            defaultValue={50}
            step={1}
            marks={{
              10: "10%",
              150: "150%",
            }}
            onChange={handlePercentChange}
            value={PPYCollatPercent}
          />
        </Col>
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <Text strong>PPY Stake</Text>
              <Tooltip title="PPY stake needed to reach collateral percentage">
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
            <InputNumber
              style={{ width: "100%" }}
              value={Number(formatEther(realPPYAmount))}
              addonAfter={"PPY"}
              type="number"
              onChange={handlePPYStake}
            />
          </Space>
        </Col>
      </Row>
    </>
  );
}
