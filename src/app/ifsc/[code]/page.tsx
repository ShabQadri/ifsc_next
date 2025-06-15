import { Metadata } from 'next';

async function fetchIfscData(code: string) {
  const res = await fetch(`https://ifsc-proxy.ifsc-proxy.workers.dev/ifsc/${code}`, { cache: 'force-cache' });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const code = params.code.toUpperCase();
  const data = await fetchIfscData(code);
  if (!data) return { title: `IFSC Not Found` };
  return {
    title: `${code} - ${data.BANK} Branch IFSC Details`,
    description: `Branch details for IFSC ${code}: ${data.BANK}, ${data.BRANCH}, ${data.ADDRESS}`,
  };
}

export default async function IfscPage({ params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  const data = await fetchIfscData(code);

  if (!data) {
    return (
      <>
        <h1>IFSC Lookup</h1>
        <div style={{ color: 'red', fontSize: '1.2em', margin: "2em 0" }}>
          IFSC code <b>{code}</b> not found.
        </div>
        <a href="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>&#8592; Back to search</a>
      </>
    );
  }

  return (
    <>
      <h1>{data.BANK}</h1>
      <div style={{
        background: '#e3f2fd',
        borderRadius: 10,
        padding: '18px 16px',
        margin: '0 auto 1em auto',
        fontSize: '1.08em'
      }}>
        <div><b>IFSC:</b> {data.IFSC}</div>
        <div><b>Branch:</b> {data.BRANCH}</div>
        <div><b>State:</b> {data.STATE}</div>
        <div><b>District:</b> {data.DISTRICT}</div>
        <div><b>City:</b> {data.CITY}</div>
        <div><b>MICR:</b> {data.MICR}</div>
        <div><b>Contact:</b> {data.CONTACT}</div>
        <div><b>Address:</b> {data.ADDRESS}</div>
        <div><b>UPI:</b> {data.UPI ? 'Yes' : 'No'}</div>
        <div><b>IMPS:</b> {data.IMPS ? 'Yes' : 'No'}</div>
        <div><b>NEFT:</b> {data.NEFT ? 'Yes' : 'No'}</div>
        <div><b>RTGS:</b> {data.RTGS ? 'Yes' : 'No'}</div>
        <div><b>SWIFT:</b> {data.SWIFT || '-'}</div>
      </div>
      <a href="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>&#8592; Back to search</a>
    </>
  );
}