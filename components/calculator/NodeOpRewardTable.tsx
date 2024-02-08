import {
  Checkbox,
  Typography,
  Col,
  Row,
  Table,
  Button,
  Input,
  InputRef,
  Space,
  Tooltip,
  theme,
} from "antd";
import { commify, formatEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import { CopyableAddress } from "@/components/Copyable";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRef, useState } from "react";
import { Staker } from "@/pages/calculator";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

export function NodeOpRewardTable({
  title,
  ggpStaked,
  stakers,
  handleCheck,
  details,
  checked,
}: {
  title: "Retail Node Ops" | "Investor Node Ops";
  details: string;
  ggpStaked: BigNumber;
  stakers: Staker[];
  checked: boolean;
  handleCheck: (e: CheckboxChangeEvent) => void;
}) {
  const [show, setShow] = useState(false);
  const { token } = theme.useToken();
  const { Title, Text, Paragraph } = Typography;

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
  };

  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    confirm();
  };

  const searchInput = useRef<InputRef>();

  const getColumnSearchProps = (dataIndex: string, display: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys?: any;
      selectedKeys?: any;
      confirm?: any;
      clearFilters?: any;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            if (node == null) {
              return;
            } else if (node !== null && searchInput.current === null) {
              searchInput.current = node;
            }
          }}
          placeholder={`Search ${display}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <Tooltip title={`Filter by ${display}`}>
        <FilterOutlined
          style={{
            color: filtered ? token.colorPrimary : token.colorTextSecondary,
            fontSize: "16px",
          }}
        />
      </Tooltip>
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownChange: (visible: any) => {
      if (visible) {
        setTimeout(
          () =>
            searchInput && searchInput.current && searchInput.current.select()
        );
      }
    },
  });
  const stakerColumns = [
    {
      title: "Staker Addr",
      dataIndex: "stakerAddr",
      key: "stakerAddr",
      ...getColumnSearchProps("stakerAddr", "Staker Address"),
      render: (stakerAddr: string) => <CopyableAddress address={stakerAddr} />,
    },
    {
      title: "Effective GGP Staked",
      dataIndex: "ggpStake",
      key: "ggpStake",
      render: (ggpStake: string) => (
        <>{`${commify((+formatEther(ggpStake)).toFixed(2))}`}</>
      ),
    },
    {
      title: "Collateral Ratio",
      dataIndex: "collateralRatio",
      key: "collateralRatio",
      render: (collateralRatio: string) => (
        <>{`${(+formatEther(collateralRatio) * 100).toFixed(2)}%`}</>
      ),
    },
    {
      title: "Share of All GGP Staked",
      dataIndex: "percentStake",
      key: "percentStake",
      render: (percentStake: string) => (
        <>{`${(+formatEther(percentStake) * 100).toFixed(2)}%`}</>
      ),
    },
    {
      title: "Monthly GGP Reward",
      dataIndex: "ggpReward",
      key: "ggpReward",
      render: (ggpReward: string) => (
        <>{`${commify((+formatEther(ggpReward)).toFixed(2))}`}</>
      ),
    },
    {
      title: "Monthly Reward amount in AVAX",
      dataIndex: "avaxReward",
      key: "avaxReward",
      render: (avaxReward: string) => (
        <>{`${commify((+formatEther(avaxReward)).toFixed(2))}`}</>
      ),
    },
    {
      title: "Monthly Reward amount in USD",
      dataIndex: "usdReward",
      key: "usdReward",
      render: (usdReward: string) => (
        <>{`$${commify((+formatEther(usdReward)).toFixed(2))}`}</>
      ),
    },
  ];

  return (
    <>
      <Row justify={"start"} align="middle" gutter={32}>
        <Col lg={8} md={10} sm={12}>
          <Title level={2}>{`${title}`}</Title>
        </Col>
        <Col lg={8} md={10} sm={12}>
          <Title level={3}>
            Effective GGP Staked:{" "}
            {`${commify((+formatEther(ggpStaked)).toFixed(2))}`}
          </Title>
        </Col>
        <Col lg={14} sm={20}>
          <Paragraph
            style={{ cursor: "pointer" }}
            onClick={() => setShow(!show)}
          >
            {show ? (
              <Text strong>{details}</Text>
            ) : (
              <Text strong>Show details</Text>
            )}
          </Paragraph>
        </Col>
      </Row>
      <Row align={"middle"}>
        {title === "Retail Node Ops" && (
          <Checkbox
            checked={checked}
            style={{ paddingBottom: 16 }}
            onChange={(e) => handleCheck(e)}
          >
            <Text strong style={{ fontSize: 18 }}>
              Include your minipool
            </Text>
          </Checkbox>
        )}
      </Row>
      <Table columns={stakerColumns} dataSource={stakers} />
    </>
  );
}
