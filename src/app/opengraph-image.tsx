import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cool or Trash? - Rate Weird Products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 100, marginBottom: 10 }}>
          <span>😎</span>
          <span style={{ marginLeft: 40, marginRight: 40, fontSize: 80 }}>vs</span>
          <span>🗑️</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 900,
            color: "#0a0a0a",
            marginBottom: 10,
          }}
        >
          <span>Cool</span>
          <span style={{ color: "#ef4444" }}>Or</span>
          <span>Trash?</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#8b5cf6",
            fontWeight: 700,
          }}
        >
          Rate the internet's weirdest products
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#a3a3a3",
            marginTop: 20,
            fontWeight: 600,
          }}
        >
          CoolOrTrash.com
        </div>
      </div>
    ),
    { ...size }
  );
}
