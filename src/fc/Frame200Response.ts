import { FrameContent } from "./FrameContent";

export function Frame200Response(frameContent: FrameContent): Response {
  const { frameButtons, frameImageUrl, framePostUrl, frameTitle, frameVersion, input } = frameContent
  const imgUrlWithDate = frameImageUrl.includes('?') ? 
    frameImageUrl + `&date=${Date.now()}`
    : frameImageUrl + `?date=${Date.now()}`
  const html = `
      <!DOCTYPE html> 
      <html>
        <head>
          <title>${frameTitle}</title>
          <meta property="og:title" content="${frameTitle}" />
          <meta property="og:description" content="${frameTitle}" />
          <meta property="og:image" content="${imgUrlWithDate}" />
          <meta name="fc:frame" content="${frameVersion}" />
          <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />

          <meta name="fc:frame:image" content="${imgUrlWithDate}" />
          <meta name="fc:frame:post_url" content="${framePostUrl}" />
          ${input ? `<meta name="fc:frame:input:text" content="Enter any NFT token address:"/>` : ''}
          ${frameButtons.map(
    (bn, i) => `
    <meta name="fc:frame:button:${i + 1}" content="${bn.label}" />
    <meta name="fc:frame:button:${i + 1}:action" content="${bn.action}" />
    ${bn.target ? `<meta name="fc:frame:button:${i + 1}:target" content="${bn.target}"` : ""}
    `
  )}
        </head>
        <body>
          <h1>interframe</h1>
          <dl>
            <dt>In action</dt>
            <dd><a href="https://warpcast.com/3070/0x316492d0">https://warpcast.com/3070/0x316492d0</a></dd>
            <dt>Code</dt>
            <dd><a href="https://github.com/eucalyptus-viminalis/interframe">GitHub</a></dd>
          </dl>
          <hr>
          <p>Built by 3070 (<a href="https://warpcast.com/3070">Warpcast Profile</a>)
        </body>
      </html>
    `;

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
}
