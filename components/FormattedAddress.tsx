export function shortenCryptoAddress(address: string, prefixLength = 6) {
  const suffixLength = 4; // Length of the suffix to keep

  if (address.length <= prefixLength + suffixLength) {
    // Address is too short, return as it is
    return address;
  }

  const prefix = address.substring(0, prefixLength);
  const suffix = address.substring(address.length - suffixLength);
  const shortenedAddress = `${prefix}...${suffix}`;

  return shortenedAddress;
}

export const FormattedAddress = ({ address, prefix = 6 }: any) => {
  return (
    <span style={{ fontFamily: "'Source Code Pro', monospace" }}>
      {shortenCryptoAddress(address, prefix)}
    </span>
  );
};
