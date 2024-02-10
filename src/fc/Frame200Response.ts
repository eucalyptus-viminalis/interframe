import { FrameContent } from "./FrameContent";

export function Frame200Response(frameContent: FrameContent): Response {
  const { frameButtons, frameImageUrl, framePostUrl, frameTitle, frameVersion, input } = frameContent
  const html = `
      <!DOCTYPE html> 
      <html>
        <head>
          <title>${frameTitle}</title>
          <meta property="og:title" content="${frameTitle}" />
          <meta property="og:description" content="${frameTitle}" />
          <meta property="og:image" content="${frameImageUrl + '&date=' + Date.now()}" />
          <meta name="fc:frame" content="${frameVersion}" />
          <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />

          <meta name="fc:frame:image" content="${frameImageUrl + '&date=' + Date.now()}" />
          <meta name="fc:frame:post_url" content="${framePostUrl}" />
          ${input ? `<meta name="fc:frame:input:text" content="Enter a different token address:"/>` : null}
          ${frameButtons.map(
    (bn, i) => `<meta name="fc:frame:button:${i + 1}" content="${bn.label}" />`
  )}
        </head>
        <body>
          <h1>inteframe</h1>
          <dl>
            <dt>In action</dt>
            <dd><a href="https://warpcast.com/3070">https://warpcast.com/3070</a></dd>
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
