interface String {
    isValidEthereumAddress(): boolean;
}
// Implement extension method
String.prototype.isValidEthereumAddress = function (): boolean {
    console.log("This is a custom method for strings.");
    const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;

    return ethereumAddressRegex.test(String(this));
};

