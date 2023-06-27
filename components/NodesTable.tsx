import React from "react";
import { Card, Table, Button, Typography } from "antd";
const { ethers } = require("ethers");
const { Title } = Typography;
import { useContractRead } from "wagmi";
import minipoolManagerABI from "../abis/minipoolmanager.json";
const hashEmoji = require("hash-emoji");
const { Text, Link } = Typography;
const { Column, ColumnGroup } = Table;
import { formatDistance } from "date-fns";
import { BinTools } from "avalanche";
import { FormattedAddress } from "./FormattedAddress";

const bintools = BinTools.getInstance();

const weiValue = ethers.BigNumber.from("1000000000000000000"); // represents 1 Ether in wei (10^18)

const nodeHexToID = (h: any) => {
  if (!h) return "";
  console.log(h);
  const b = Buffer.from(ethers.utils.arrayify(ethers.utils.getAddress(h)));
  return `NodeID-${bintools.cb58Encode(b as any)}`;
};

const App: React.FC = () => {
  const [pageSize, setPageSize] = React.useState(5);

  const { data: minipoolData, isLoading }: any = useContractRead({
    address: "0xc8de41c35fb389286546cf4107102a7656da7037",
    abi: minipoolManagerABI,
    functionName: "getMinipools",
    args: [2, 0, 100],
  });
  const reversedData = minipoolData ? minipoolData.toReversed() : [];
  console.log(minipoolData);

  return (
    <Card title="Minipools">
      <Table
        size="small"
        scroll={{ x: true }}
        bordered={false}
        loading={isLoading}
        dataSource={reversedData}
        pagination={{
          pageSize,
          pageSizeOptions: ["5", "10", "50", "500"],
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageSize(size);
          },
        }}
      >
        <Column
          title="NodeID"
          dataIndex="1"
          key="nodeID"
          render={(n) => {
            return (
              <>
                <Link
                  copyable={{ text: nodeHexToID(n) }}
                  href={`https://avascan.info/staking/validator/${nodeHexToID(
                    n
                  )}`}
                >
                  {<FormattedAddress prefix={11} address={nodeHexToID(n)} />}
                </Link>
              </>
            );
          }}
        />
        <Column
          title="Owner"
          dataIndex="5"
          key="2"
          render={(n) => {
            return (
              <>
                {hashEmoji(n)}
                {` `}
                <Link
                  copyable={{ text: n }}
                  href={`https://snowtrace.io/address/${n}`}
                >
                  {<FormattedAddress address={n} />}
                </Link>
              </>
            );
          }}
        />
        <Column
          title="Node OP Avax"
          dataIndex="8"
          key="2"
          render={(n) => {
            return n.div(weiValue).toNumber();
          }}
        />

        <Column
          title="Created"
          dataIndex="11"
          key="3"
          render={(n) => {
            const date = new Date(n.toNumber() * 1000);
            const timeAgo = formatDistance(date, new Date(), {
              addSuffix: true,
            });

            return timeAgo;
          }}
        />
      </Table>
    </Card>
  );
};

export default App;
