'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script';

// Declare html2pdf for TypeScript content
declare const html2pdf: any;

export default function SignContractPage() {
    const { token } = useParams<{ token: string }>();
    // Use state for router availability to avoid hydration mismatch
    const [mounted, setMounted] = useState(false);
    const router = useRouter(); // Standard hook usage

    const [contract, setContract] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [signing, setSigning] = useState(false);

    // Signature Canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    // Form confirmation
    const [confirmName, setConfirmName] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');

    // Missing Details State
    const [needsDetails, setNeedsDetails] = useState(false);
    const [tenantDetails, setTenantDetails] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });
    const [savingDetails, setSavingDetails] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (token) {
            loadContract(token);
        }
    }, [token]);

    const loadContract = async (t: string) => {
        try {
            // We'll Create an endpoint to get contract by token
            // Since we didn't create it explicitly in the plan, I'll create it now as part of this flow
            // Or assume /api/contracts/sign defaults to GET for fetch?
            // Let's create a specific GET endpoint or update the Sign route to handle GET.
            // For now, I'll assume /api/contracts/sign?token=X returns the contract.
            const res = await fetch(`/api/contracts/sign?token=${t}`);
            if (!res.ok) throw new Error('Invalid or expired token');
            const data = await res.json();
            setContract(data);

            // Check if tenant details are missing
            if (!data.tenant_first_name || !data.tenant_last_name) {
                setNeedsDetails(true);
            }
        } catch (err) {
            setError('Invalid or expired contract link.');
        } finally {
            setLoading(false);
        }
    };

    // Canvas Drawing Logic
    const startDrawing = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasSignature(true);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        e.preventDefault(); // Prevent scrolling on touch

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleSaveDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingDetails(true);
        try {
            const res = await fetch('/api/contracts/update-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    tenant_first_name: tenantDetails.first_name,
                    tenant_last_name: tenantDetails.last_name,
                    tenant_email: tenantDetails.email
                })
            });

            if (res.ok) {
                // Reload contract to get the updated HTML with names filled in
                await loadContract(token!);
                setNeedsDetails(false);
            } else {
                alert('Failed to save details');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving details');
        } finally {
            setSavingDetails(false);
        }
    };

    const handleSign = async () => {
        if (!hasSignature) return alert('Please sign the contract');
        if (confirmName.trim().toLowerCase() !== `${contract.tenant_first_name} ${contract.tenant_last_name}`.toLowerCase().trim()) {
            return alert('Please enter your full name exactly as it appears in the contract confirmation.');
        }

        setSigning(true);

        try {
            // 1. Capture Signature Image
            const signatureData = canvasRef.current?.toDataURL('image/png');

            // 2. Client-side PDF Generation (using html2pdf.js loaded via Script)
            // We append the signature to the contract HTML container before generating
            const element = document.getElementById('contract-content');
            if (!element) return;

            // Clone the element to modify it for PDF (add signature)
            const pdfContainer = element.cloneNode(true) as HTMLElement;
            const signDiv = document.createElement('div');
            signDiv.innerHTML = `
            <div style="margin-top: 50px; page-break-inside: avoid;">
                <p><strong>Signed by:</strong> ${confirmName}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <img src="${signatureData}" style="width: 200px; border-bottom: 1px solid #000;" />
            </div>
        `;
            pdfContainer.appendChild(signDiv);

            const pdfOptions = {
                margin: 10,
                filename: `contract_${contract.token}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Generate Blob
            const pdfBlob = await html2pdf().from(pdfContainer).set(pdfOptions).output('blob');

            // 3. Upload PDF and Signature Data
            const formData = new FormData();
            formData.append('token', token!);
            formData.append('signature', signatureData!);
            formData.append('pdf', pdfBlob, `contract_${token}.pdf`);

            // Send to API
            const res = await fetch('/api/contracts/sign', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                alert('Contract signed successfully! A copy has been emailed to you.');
                // Optionally redirect to a success page or show success state
                if (mounted) router.push('/'); // Go to home or success
            } else {
                const errData = await res.json();
                alert(errData.error || 'Failed to submit signature');
            }

        } catch (err) {
            console.error(err);
            alert('Error signing contract');
        } finally {
            setSigning(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading contract...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    if (needsDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold mb-6 text-center">Welcome!</h1>
                    <p className="text-gray-600 mb-6 text-center">Please enter your details to view and sign the contract.</p>

                    <form onSubmit={handleSaveDetails} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input
                                type="text"
                                required
                                className="w-full border p-2 rounded"
                                value={tenantDetails.first_name}
                                onChange={e => setTenantDetails({ ...tenantDetails, first_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input
                                type="text"
                                required
                                className="w-full border p-2 rounded"
                                value={tenantDetails.last_name}
                                onChange={e => setTenantDetails({ ...tenantDetails, last_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full border p-2 rounded"
                                value={tenantDetails.email}
                                onChange={e => setTenantDetails({ ...tenantDetails, email: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={savingDetails}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-600 transition disabled:opacity-50"
                        >
                            {savingDetails ? 'Saving...' : 'Continue to Contract'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="lazyOnload" />

            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <header className="bg-slate-900 text-white p-6">
                    <h1 className="text-2xl font-bold">Rental Contract Review</h1>
                    <p className="opacity-80">Please review and sign your contract below.</p>
                </header>

                <div className="p-8">
                    {/* Contract Content View */}
                    <div
                        id="contract-content"
                        className="prose max-w-none mb-8 p-8 border border-gray-100 bg-white shadow-sm"
                        dangerouslySetInnerHTML={{ __html: contract.contract_html }}
                    />

                    <hr className="my-8" />

                    {/* Signing Section */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Sign Contract</h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm Full Name</label>
                                <input
                                    type="text"
                                    placeholder={`${contract.tenant_first_name} ${contract.tenant_last_name}`}
                                    className="w-full border p-2 rounded"
                                    value={confirmName}
                                    onChange={e => setConfirmName(e.target.value)}
                                />
                                <p className="text-xs text-gray-400 mt-1">Must match: {contract.tenant_first_name} {contract.tenant_last_name}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Signature</label>
                            <div className="border border-gray-300 bg-white inline-block">
                                <canvas
                                    ref={canvasRef}
                                    width={500}
                                    height={200}
                                    className="touch-none cursor-crosshair"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                />
                            </div>
                            <div className="mt-2">
                                <button onClick={clearSignature} className="text-sm text-red-600 hover:underline">Clear Signature</button>
                            </div>
                        </div>

                        <button
                            onClick={handleSign}
                            disabled={signing || !hasSignature}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                        >
                            {signing ? 'Finalizing...' : 'Sign & Complete Contract'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
