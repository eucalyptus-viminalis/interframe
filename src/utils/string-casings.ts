
interface String {
  toTitleCase(): string;
}
// Implement extension method
String.prototype.toTitleCase = function(): string {
  return this.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
};
