import React from "react";
import { Table, Button, Typography, Card } from "antd";
import CustomLayout from "@/components/Layout/Layout";
const { Link, Text } = Typography;

const data = [
  {
    contract: "ClaimNodeOp",
    address: "0xb42CfaD450B46FDc9cAC5FBF14Bc2e6091AfC35c",
  },
  {
    contract: "ClaimProtocolDAO",
    address: "0x4169CF88c7Ed811E6f6e61917c5b915BeA49476c",
  },
  {
    contract: "MinipoolManager",
    address: "0xC8De41C35FB389286546cF4107102a7656Da7037",
  },
  {
    contract: "MultisigManager",
    address: "0x7fff419c562Dd8b3cf16C335a01CDb37ea1B6a3B",
  },
  {
    contract: "Ocyticus",
    address: "0x9189d18F453b1Ec1F02E40A8e3711334f9eA210B",
  },
  {
    contract: "Oracle",
    address: "0x30fb915258D844E9dC420B2C3AA97420AEA16Db7",
  },
  {
    contract: "ProtocolDAO",
    address: "0x41A76343eb93B4790e53c8E2789E09EF41195D0B",
  },
  {
    contract: "RewardsPool",
    address: "0xAA8FD06cc3f1059b6d35870Bbf625C1Bac7c1B1D",
  },
  {
    contract: "Staking",
    address: "0x9946e68490D71Fe976951e360f295c4Cf8531D00",
  },
  {
    contract: "Storage",
    address: "0x1cEa17F9dE4De28FeB6A102988E12D4B90DfF1a9",
  },
  {
    contract: "Vault",
    address: "0xd45Cb6F5AcA41AfAAAeBdBE4EFBA49c1bC41E6BA",
  },
  {
    contract: "TokenGGP",
    address: "0x69260B9483F9871ca57f81A90D91E2F96c2Cd11d",
  },
  {
    contract: "TokenggAVAX",
    address: "0xA25EaF2906FA1a3a13EdAc9B9657108Af7B703e3",
  },
  {
    contract: "Multicall",
    address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  },
];

const columns = [
  {
    title: "Contracts",
    dataIndex: "contract",
    key: "contract",
  },
  {
    title: "Addresses",
    dataIndex: "address",
    key: "address",
    render: (address: string) => (
      <Link
        href={`https://snowtrace.io/address/${address}#readContract`}
        style={{ fontFamily: "'Source Code Pro', monospace" }}
        copyable
      >
        {address}
      </Link>
    ),
  },
];

const ContractTable = () => {
  return (
    <Card title="GoGoPool Contracts">
      <Table
        size="small"
        pagination={{ pageSize: 50 }}
        dataSource={data}
        columns={columns}
      />
    </Card>
  );
};

const App = () => {
  return (
    <CustomLayout>
      <ContractTable />
    </CustomLayout>
  );
};

export default App;
