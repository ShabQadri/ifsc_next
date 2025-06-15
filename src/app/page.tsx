'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const API = 'https://ifsc-proxy.ifsc-proxy.workers.dev';

type Branch = {
  IFSC: string;
  BANK: string;
  BRANCH: string;
  STATE: string;
  DISTRICT: string;
  CITY: string;
  ADDRESS: string;
};

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState<'location' | 'ifsc'>('location');
  const [banks, setBanks] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selected, setSelected] = useState({
    bank: '',
    state: '',
    district: '',
    branch: '',
  });
  const [ifsc, setIfsc] = useState('');

  // Fetch banks on load
  useEffect(() => {
    fetch(`${API}/banks`).then(r => r.json()).then(setBanks);
  }, []);

  // Fetch states when bank selected
  useEffect(() => {
    if (selected.bank)
      fetch(`${API}/states/${encodeURIComponent(selected.bank)}`).then(r => r.json()).then(setStates);
    else
      setStates([]);
    setSelected(prev => ({ ...prev, state: '', district: '', branch: '' }));
    setDistricts([]);
    setBranches([]);
  }, [selected.bank]);

  // Fetch districts when state selected
  useEffect(() => {
    if (selected.bank && selected.state)
      fetch(`${API}/districts/${encodeURIComponent(selected.bank)}/${encodeURIComponent(selected.state)}`)
        .then(r => r.json()).then(setDistricts);
    else
      setDistricts([]);
    setSelected(prev => ({ ...prev, district: '', branch: '' }));
    setBranches([]);
  }, [selected.state, selected.bank]);

  // Fetch branches when district selected
  useEffect(() => {
    if (selected.bank && selected.state && selected.district)
      fetch(`${API}/branches/${encodeURIComponent(selected.bank)}/${encodeURIComponent(selected.state)}/${encodeURIComponent(selected.district)}`)
        .then(r => r.json()).then(setBranches);
    else
      setBranches([]);
    setSelected(prev => ({ ...prev, branch: '' }));
  }, [selected.district, selected.state, selected.bank]);

  function resetForm() {
    setSelected({ bank: '', state: '', district: '', branch: '' });
    setBranches([]);
    setDistricts([]);
    setStates([]);
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <Image src="https://ifsc-lookup.pages.dev/icon.png" alt="" width={48} height={48} style={{ marginBottom: 8 }} />
        <h1 style={{ marginBottom: 6 }}>IFSC Code Lookup</h1>
        <div style={{ color: '#555', fontSize: '1.15em', marginBottom: 18 }}>
          Find Indian Financial System Codes for banks across India. Search by bank, state, district, branch, or IFSC code.
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
          <button className={`btn btn-primary${tab === 'location' ? '' : ' btn-secondary'}`}
            onClick={() => setTab('location')}>
            Search by Location
          </button>
          <button className={`btn btn-primary${tab === 'ifsc' ? '' : ' btn-secondary'}`}
            onClick={() => setTab('ifsc')}>
            Search by IFSC
          </button>
        </div>
      </div>

      {tab === 'location' && (
        <div className="search-card">
          <form onSubmit={e => {
            e.preventDefault();
            if (selected.branch) router.push(`/ifsc/${selected.branch}`);
          }}>
            <div className="form-row">
              <select
                value={selected.bank}
                onChange={e => setSelected({ bank: e.target.value, state: '', district: '', branch: '' })}
                required>
                <option value="">Bank Name</option>
                {banks.map(b => <option value={b} key={b}>{b}</option>)}
              </select>
              <select
                value={selected.state}
                onChange={e => setSelected(prev => ({ ...prev, state: e.target.value, district: '', branch: '' }))}
                disabled={!selected.bank} required>
                <option value="">Select State</option>
                {states.map(s => <option value={s} key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-row">
              <select
                value={selected.district}
                onChange={e => setSelected(prev => ({ ...prev, district: e.target.value, branch: '' }))}
                disabled={!selected.state} required>
                <option value="">Select District</option>
                {districts.map(d => <option value={d} key={d}>{d}</option>)}
              </select>
              <select
                value={selected.branch}
                onChange={e => setSelected(prev => ({ ...prev, branch: e.target.value }))}
                disabled={!selected.district} required>
                <option value="">Select Branch</option>
                {branches.map(b => (
                  <option value={b.IFSC} key={b.IFSC}>
                    {b.BRANCH} ({b.CITY})
                  </option>
                ))}
              </select>
            </div>
            <div className="button-row">
              <button type="submit" className="btn btn-primary" disabled={!selected.branch}>
                🔍 Find IFSC Code
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {tab === 'ifsc' && (
        <div className="search-card" style={{ maxWidth: 400, margin: "28px auto" }}>
          <form onSubmit={e => {
            e.preventDefault();
            if (ifsc.trim()) router.push(`/ifsc/${ifsc.trim().toUpperCase()}`);
          }}>
            <input
              type="text"
              placeholder="Enter IFSC code"
              value={ifsc}
              onChange={e => setIfsc(e.target.value.toUpperCase())}
              maxLength={20}
              style={{
                padding: 12, fontSize: '1.1em', width: '100%',
                border: '1px solid #1976d2', borderRadius: 6,
                marginBottom: 18, textTransform: 'uppercase'
              }}
              required
            />
            <div className="button-row">
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Search IFSC
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Example of using Link for home navigation elsewhere */}
      {/* <Link href="/">Back to Home</Link> */}
    </>
  );
}