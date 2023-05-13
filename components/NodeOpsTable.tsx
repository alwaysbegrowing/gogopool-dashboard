import React from "react";
import { Card, Table, Button, Typography } from "antd";
const { ethers } = require("ethers");
const { Title } = Typography;
import { useContractRead } from "wagmi";
import stakerABI from "../abis/staker.json";
import { toWei } from "../hooks/mounted";
const { Column, ColumnGroup } = Table;
import { formatDistance } from "date-fns";
import { useStakers } from "@/hooks/mounted";
const weiValue = ethers.BigNumber.from("1000000000000000000"); // represents 1 Ether in wei (10^18)
const hashEmoji = require("hash-emoji");
const { Text, Link } = Typography;
import { FormattedAddress } from "./FormattedAddress";

const App: React.FC = () => {
  const { data, isLoading } = useStakers();

  if (!data) return <></>;

  const cleanedData = [] as any;
  data.forEach((staker: any) => {
    if (toWei(staker[3])) {
      cleanedData.push(staker);
    }
  });
  cleanedData.sort((a: any, b: any) => toWei(b[6]) - toWei(a[6]));

  return (
    <Card title="Node Operators">
      <Table
        size="small"
        scroll={{ x: true }}
        loading={isLoading}
        dataSource={cleanedData}
        pagination={{ pageSize: 5 }}
      >
        <Column
          title="Node Address"
          dataIndex="0"
          key="2"
          render={(n) => {
            return (
              <>
                {hashEmoji(n)}
                {` `}
                <Link copyable href={`https://snowtrace.io/address/${n}`}>
                  {<FormattedAddress address={n} />}
                </Link>
              </>
            );
          }}
        />
        <Column
          title="GGP Staked"
          dataIndex="6"
          key="2"
          render={(n) => {
            return toWei(n).toLocaleString();
          }}
        />

        <Column
          title="Minipools"
          dataIndex="3"
          key="2"
          render={(n) => {
            return toWei(n) / 1000;
          }}
        />
        {/* <Column
        title="Liquid Staker Avax"
        dataIndex="9"
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
      /> */}
      </Table>
    </Card>
  );
};

export default App;
