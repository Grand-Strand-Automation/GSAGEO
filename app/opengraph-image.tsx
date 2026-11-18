import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Grand Strand Ally GEO — AI Visibility for Local Service Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #0F1E2E 0%, #13263A 55%, #0F766E 140%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#0F766E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5EEAD4",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              G
            </div>
            Grand Strand Ally
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#5EEAD4",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            AI Visibility · GEO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            AI Visibility for Local Service Businesses
          </div>
          <div style={{ fontSize: 26, color: "#C3CFDA", lineHeight: 1.35, maxWidth: 820 }}>
            Generative Engine Optimization for the Grand Strand — so ChatGPT, Google AI,
            Perplexity, Copilot and Gemini can find and recommend you.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 20, color: "#5EEAD4", fontWeight: 600 }}>
          gsageo.vercel.app · Myrtle Beach, SC
        </div>
      </div>
    ),
    { ...size },
  );
}
