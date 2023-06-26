import { FormattedAddress } from "./FormattedAddress";
import { Typography } from "antd";
const { ethers } = require("ethers");
import { BinTools } from "avalanche";
const hashEmoji = require("hash-emoji");

const { Link } = Typography;
const bintools = BinTools.getInstance();

const nodeHexToID = (h: any) => {
  if (!h) return "";
  const b = Buffer.from(ethers.utils.arrayify(ethers.utils.getAddress(h)));
  return `NodeID-${bintools.cb58Encode(b as any)}`;
};

export function CopyableNodeId({ nodeId }: { nodeId: string }) {
  return (
    <Link
      copyable={{ text: nodeHexToID(nodeId) }}
      href={`https://avascan.info/staking/validator/${nodeHexToID(nodeId)}`}
    >
      {<FormattedAddress prefix={11} address={nodeHexToID(nodeId)} />}
    </Link>
  );
}

export function CopyableAddress({ address }: { address: string }) {
  return (
    <>
      {hashEmoji(address)}
      {` `}
      <Link
        copyable={{ text: address }}
        href={`https://snowtrace.io/address/${address}`}
      >
        {<FormattedAddress address={address} />}
      </Link>
    </>
  );
}
