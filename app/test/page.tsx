// import { TokenDetails } from "../[tokenAddy]/page";



//     // return (
//             <div
//                 style={{
//                     display: "flex",
//                     width: "100%",
//                     height: "100%",
//                     color: "white",
//                     alignItems: "center",
//                     letterSpacing: '-.02em',
//                     fontWeight: 700,
//                     fontSize: 36,
//                     padding: 16,
//                     background: "linear-gradient(to bottom right, #343E90, #210446)",
//                     flexDirection: "column",
//                     justifyContent: "space-between"
//                     // textAlign: "center",
//                 }}
//             >
//                 <div
//                     id="top-bar"
//                     style={{
//                         padding: 0,
//                         margin: 0,
//                         width: '100%',
//                         display: "flex",
//                         height: "12%",
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                         alignItems: 'flex-start'
//                     }}
//                 >
//                     <div
//                         id="contractAddress"
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                         }}
//                     >
//                         {/* /0x040cABdDC5C1Ed83B66e0126E74E7F97e6eC36BC */}
//                         {ca}
//                     </div>

//                     <div
//                         id="mint-status"
//                         style={{
//                             display: "flex",
//                             flexDirection: "row",
//                             alignItems: 'flex-end',
//                             justifyContent: 'flex-end',
//                         }}
//                     >

//                         {mintStatus == "Minting" ? (
//                             <span
//                                 tw="m-1"
//                                 style={{
//                                     width: '23px',
//                                     height: '23px',
//                                     background: '#1BE33B',
//                                     borderRadius: 100
//                                 }}
//                             />
//                         ) : null }

//                         <span
//                             tw="p-1"
//                             style={{
//                                 fontFamily: '"barcode"',
//                                 fontSize: 64
//                             }}
//                         >
//                             {mintStatus}
//                         </span>
//                     </div>
//                 </div>


//                 <div
//                     id="token-name"
//                     style={{
//                         fontFamily: '"bodoni"',
//                         fontSize: "100px",
//                         margin: 0,
//                     }}
//                 >{tokenName}</div>

//                 <div
//                     id="description"
//                     tw=""
//                     style={{
//                         fontSize: '20px'
//                     }}
//                 >
//                     {tokenDescription}                    
//                 </div>

//                 <div
//                     id="bottom-bar"
//                     style={{
//                         height: '15%',
//                         width: '100%',
//                         display: 'flex',
//                         fontSize: 50,
//                         alignItems: "flex-end",
//                         justifyContent: "flex-start",
//                         letterSpacing: '-.05em',
//                         gap: 52
//                     }}
//                 >

//                     <span
//                         id="total-supply"
//                         tw="p-2 m-0"
//                         style={{
//                             fontFamily: '"barcode"'
//                         }}
//                     >
//                         Total supply: {totalSupply}
//                     </span>
                    
//                     {mintPrice ? (
//                         <span
//                             id="mint-price"
//                             tw="p-2 m-0"
//                             style={{
//                                 fontFamily: '"barcode"'
//                             }}
//                         >
//                             Mint price: {mintPrice}E
//                         </span>
//                     ) : null }

//                     <span
//                         id="network"
//                         tw="p-2 m-0"
//                         style={{
//                             fontFamily: '"barcode"'
//                         }}
//                     >
//                         Network: {networkName} - {networkId}
//                     </span>
//                     <span
//                         id="price"
//                         tw="p-2 m-0"
//                         style={{
//                             fontFamily: '"barcode"',
//                             width: '30px',
//                             height: '100%',

//                         }}
//                     >
//                     </span>


//                 </div>


//                 {/* <img
//         alt="img"
//         height="600"
//         src={`${img}`}
//         style={{
//             maxHeight: '600px',  // Set your desired maximum height
//             maxWidth: '800px',   // Set your desired maximum width
//             // borderRadius: 128,
//         }}
//     /> */}
//             </div>
//     )
// }