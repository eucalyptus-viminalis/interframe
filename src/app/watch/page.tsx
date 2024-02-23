// import NewBlock from "./NewBlock";
import NewBlock from "./NewBlock";
import NewBlockNumber from "./NewBlockNumber";

export default async function WatchPage() {
  return (
    <div>
      <h1>lol</h1>
      <NewBlockNumber />
      <NewBlock />
      {/* <NewBlockWithProps client={client} /> */}
      {/* <p>{AppConfig.baseWsUrlDRPC}</p> */}
    </div>
  );
}
