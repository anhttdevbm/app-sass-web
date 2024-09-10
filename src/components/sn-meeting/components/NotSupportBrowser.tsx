export default function NotSupportBrowser() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <p
        style={{
          color: "#fff",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Oops...
      </p>
      <p
        style={{
          color: "#fff",
          fontSize: "18px",
          margin: "4px 0",
        }}
      >
        Your browser is not supported :-(
      </p>
      <p
        style={{
          color: "#fff",
          fontSize: "18px",
          margin: "4px 0",
        }}
      >
        Please use another browser to use this feature.
      </p>
      <p
        style={{
          color: "#fff",
          fontSize: "18px",
          margin: "4px 0",
        }}
      >
        Thank you!
      </p>
    </div>
  );
}
