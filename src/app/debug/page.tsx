export const dynamic = "force-dynamic";

export default function DebugPage() {
  const envKeys = [
    "NODE_ENV",
    "AUTH_SECRET",
    "AUTH_GITHUB_ID",
    "AUTH_GITHUB_SECRET",
    "AUTH_TRUST_HOST",
    "HOSTNAME",
    "PORT",
  ];

  return (
    <div style={{ fontFamily: "monospace", padding: 32 }}>
      <h1>ENV Debug</h1>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #666", padding: 8 }}>Key</th>
            <th style={{ border: "1px solid #666", padding: 8 }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {envKeys.map((key) => (
            <tr key={key}>
              <td style={{ border: "1px solid #666", padding: 8 }}>{key}</td>
              <td style={{ border: "1px solid #666", padding: 8 }}>
                {process.env[key] ?? <em>(undefined)</em>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
