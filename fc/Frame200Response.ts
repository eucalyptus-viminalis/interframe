import { FrameContent } from "./FrameContent";

export function Frame200Response(frameContent: FrameContent): Response {
    const { frameButtons, frameImageUrl, framePostUrl, frameTitle, frameVersion} = frameContent
    const html = `
      <!DOCTYPE html> 
      <html>
        <head>
          <title>${frameTitle}</title>
          <meta property="og:title" content="${frameTitle}" />
          <meta property="og:description" content="${frameTitle}" />
          <meta property="og:image" content="${frameImageUrl}" />
          <meta name="fc:frame" content="${frameVersion}" />
          <meta name="fc:frame:image" content="${frameImageUrl}" />
          <meta name="fc:frame:post_url" content="${framePostUrl}" />
          ${frameButtons.map(
            (bn, i) => `<meta name="fc:frame:button:${i+1}" content="${bn.label}" />`
          )}
          ${frameButtons.filter(bn => bn.action == 'post_redirect').map(
            (bn, i) => `<meta name="fc:frame:button:${i+1}:action" content="${bn.action}" />`
          )}
        </head>
        <body>
          <h1>ipfs timer</h1>
          <p>Farcaster Frame to see a Zora collection's stats and latest mints at a glance.</p>
          <dl>
            <dt>In action</dt>
            <dd><a href="https://warpcast.com/3070/0x07bf940d">https://warpcast.com/3070/0x07bf940d</a></dd>
            <dt>Code</dt>
            <dd><a href="https://github.com/eucalyptus-viminalis/see-zora">GitHub</a></dd>
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
  