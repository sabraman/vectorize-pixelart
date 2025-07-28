import { ImageResponse } from 'next/og';

async function loadGoogleFont(font: string, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

    if (resource && resource[1]) {
      const response = await fetch(resource[1]);
      if (response.status == 200) {
        return await response.arrayBuffer();
      }
    }
  } catch (error) {
    console.log('Font loading failed, using fallback');
  }

  return null;
}

export const runtime = 'edge';

export async function GET() {
  const text = 'VECTORIZE PIXELART PNG → SVG & PDF UPLOAD PROCESS DOWNLOAD';
  const fontData = await loadGoogleFont('Press+Start+2P', text);
  
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          fontFamily: fontData ? 'Press_Start_2P' : 'monospace',
          imageRendering: 'pixelated',
        }}
      >
        {/* Bold pixelart background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(0deg, #FF197C 1px, transparent 1px),
              linear-gradient(90deg, #FF197C 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px',
            opacity: 0.1,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Bold pixelart logo */}
          <div
            style={{
              width: '160px',
              height: '160px',
              backgroundColor: '#FF197C',
              border: '2px solid #FF197C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              imageRendering: 'pixelated',
              boxShadow: '2px 2px 0px #000000',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Authentic pixelart logo SVG */}
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 3H2v18h20v-2h-2v-2h2v-2h-2v-2h2v-2h-2V9h2V7h-2V5h2V3zm-2 4v2h-2v2h2v2h-2v2h2v2h-2v2H4V5h14v2h2zm-6 2h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2v-2h2v2h2v-2h-2V9zM6 7h2v2H6V7z" fill="#FF197C" />
              </svg>
            </div>
          </div>

          {/* Bold title */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 30px 0',
              fontFamily: fontData ? 'Press_Start_2P' : 'monospace',
              letterSpacing: '3px',
              lineHeight: '1.1',
              textShadow: '6px 6px 0px #FF197C, 12px 12px 0px #000000',
              imageRendering: 'pixelated',
            }}
          >
            VECTORIZE
          </h1>

          <h2
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#FF197C',
              margin: '0 0 50px 0',
              fontFamily: fontData ? 'Press_Start_2P' : 'monospace',
              letterSpacing: '2px',
              textShadow: '4px 4px 0px #000000',
            }}
          >
            PIXELART
          </h2>

          {/* Bold subtitle */}
          <p
            style={{
              fontSize: '20px',
              color: '#FFFFFF',
              margin: '0 0 60px 0',
              fontWeight: '600',
              fontFamily: fontData ? 'Press_Start_2P' : 'monospace',
              letterSpacing: '2px',
              lineHeight: '1.3',
              textShadow: '2px 2px 0px #000000',
            }}
          >
            PNG → SVG & PDF
          </p>

          {/* Bold pixelart icons using authentic SVG */}
          <div
            style={{
              display: 'flex',
              gap: '80px',
              marginTop: '30px',
            }}
          >
            {/* Upload Icon */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#FF197C',
                  border: '4px solid #FF197C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '4px 4px 0px #000000',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Authentic upload icon */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5V3h2v2h2v2h2v2h-2V7h-2v10h-2V7H9v2H7V7h2V5h2zM3 15v6h18v-6h-2v4H5v-4H3z" fill="#FF197C" />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: '14px', color: '#FFFFFF', fontFamily: fontData ? 'Press_Start_2P' : 'monospace', textShadow: '2px 2px 0px #000000' }}>UPLOAD</span>
            </div>

            {/* Process Icon */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#FF197C',
                  border: '4px solid #FF197C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '4px 4px 0px #000000',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Authentic process icon */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2h-2v6h2V2zm0 14h-2v6h2v-6zm9-5v2h-6v-2h6zM8 13v-2H2v2h6zm7-6h2v2h-2V7zm4-2h-2v2h2V5zM9 7H7v2h2V7zM5 5h2v2H5V5zm10 12h2v2h2v-2h-2v-2h-2v2zm-8 0v-2h2v2H7v2H5v-2h2z" fill="#FF197C" />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: '14px', color: '#FFFFFF', fontFamily: fontData ? 'Press_Start_2P' : 'monospace', textShadow: '2px 2px 0px #000000' }}>PROCESS</span>
            </div>

            {/* Download Icon */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#FF197C',
                  border: '4px solid #FF197C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '4px 4px 0px #000000',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Authentic download icon */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 17V3h-2v10H9v-2H7v2h2v2h2v2h2zm8 2v-4h-2v4H5v-4H3v6h18v-2zm-8-6v2h2v-2h2v-2h-2v2h-2z" fill="#FF197C" />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: '14px', color: '#FFFFFF', fontFamily: fontData ? 'Press_Start_2P' : 'monospace', textShadow: '2px 2px 0px #000000' }}>DOWNLOAD</span>
            </div>
          </div>
        </div>

        {/* Bold corner decorations */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            width: '24px',
            height: '24px',
            border: '4px solid #FF197C',
            borderRight: 'none',
            borderBottom: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            width: '24px',
            height: '24px',
            border: '4px solid #FF197C',
            borderLeft: 'none',
            borderBottom: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            width: '24px',
            height: '24px',
            border: '4px solid #FF197C',
            borderRight: 'none',
            borderTop: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            width: '24px',
            height: '24px',
            border: '4px solid #FF197C',
            borderLeft: 'none',
            borderTop: 'none',
          }}
        />

        {/* Bold bottom border */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '8px',
            backgroundImage: 'linear-gradient(90deg, #FF197C 0%, #FF197C 25%, transparent 25%, transparent 50%, #FF197C 50%, #FF197C 75%, transparent 75%, transparent 100%)',
            backgroundSize: '16px 8px',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontData && {
        fonts: [
          {
            name: 'Press_Start_2P',
            data: fontData,
            style: 'normal',
          },
        ],
      }),
    },
  );
} 