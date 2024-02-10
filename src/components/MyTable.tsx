
const auctionStats = {
    totalAuctions: '126 a',
    totalBids: '3949 b',
    totalBidders: '704 w',
    totalBidAmount: '3172.94 E',
    totalAuctionDuration: '11207545 s'
  }
  
  const text = [
    {
      key: 'auctions',
      data: auctionStats.totalAuctions
    },
    {
      key: 'bids',
      data: auctionStats.totalBids
    },
    {
      key: 'bidders',
      data: auctionStats.totalBidders
    },
    {
      key: 'amount',
      data: auctionStats.totalBidAmount
    },
    {
      key: 'duration',
      data: auctionStats.totalAuctionDuration
    }
  ]
  
  export default function MyTable() {
    return(
      <table
        // className="
        // w-full table-fixed
        // border-4 border-black
        // "
        style={{
            width: '100%',
            tableLayout: 'fixed',
            border: 'solid black 4px'
        }}
      >
        <caption>
          Total Auction Stats
        </caption>
        <tbody>
          {text.map((text, i) => {
            return(
            <tr
              key={i}
            //   className="w-full flex flex-row justify-between"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <td
                className="
                hidden md:block
                w-1/3 origin-top-left
                scale-x-150
                "
                style={{
                    width: '33%',
                    
                }}
              >
                Total
              </td>
              <td
                // style={{
                //   width: "30ch"
                // }}
                className="
                flex flex-row items-center justify-between
                bg-black bg-opacity-70
                text-white
                px-2
                w-1/3
                "
              >
                {text.key.split('').map((char, i) => {
                  return(
                    <span
                      key={i}
                      // className="scale-x-100"
                    >
                      {char}
                    </span>
                  )
                })}
              </td>
              <td
                className="
                w-1/3
                text-right
                scale-x-150 origin-top-right
                "
              >
                {text.data}
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    )
  }