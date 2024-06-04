


function shortenAddress(address){
  if(!(typeof(address)=='string')){return ''}
  if(!(address.length>16)){return address}
  return `${address.slice(0, 10)}...${address.slice(-5)}`;
}

export {shortenAddress};