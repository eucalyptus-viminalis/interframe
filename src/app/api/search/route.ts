export function GET() {
    return new Response()
}

export function POST() {
    return new Response()
}


function isValidEthereumAddress(address: string): boolean {
    const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  
    return ethereumAddressRegex.test(address);
  }