'use client';

import { useState } from 'react';
import { Sparkles, Check, X, RefreshCw, Copy, Loader2 } from 'lucide-react';

interface AITextPolisherProps {
    rawText: string;
    polishedText?: string;
    onTextChange: (raw: string, polished: string) => void;
    language?: 'nl-BE' | 'en';
    kotMeta?: {
        title?: string;
        city?: string;
    };
}

type Status = 'idle' | 'generating' | 'done' | 'error';

export function AITextPolisher({
    rawText,
    polishedText = '',
    onTextChange,
    language = 'nl-BE',
    kotMeta
}: AITextPolisherProps) {
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [autoPolish, setAutoPolish] = useState(false);
    const [localPolished, setLocalPolished] = useState(polishedText);

    const canGenerate = rawText.trim().length >= 30;

    const handlePolish = async () => {
        if (!canGenerate) {
            setErrorMessage('Tekst moet minimaal 30 karakters bevatten');
            setStatus('error');
            return;
        }

        setStatus('generating');
        setErrorMessage('');

        try {
            const response = await fetch('/api/ai/polish-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: rawText,
                    language,
                    tone: 'professioneel-wervend',
                    maxLength: 900,
                    kotMeta
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate text');
            }

            const data = await response.json();
            setLocalPolished(data.polishedText);
            setStatus('done');

            // Don't auto-apply, let user review first
        } catch (error: any) {
            console.error('Polish error:', error);
            setErrorMessage(error.message || 'Er ging iets mis. Probeer opnieuw.');
            setStatus('error');
        }
    };

    const handleApply = () => {
        onTextChange(rawText, localPolished);
    };

    const handleRegenerate = () => {
        handlePolish();
    };

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(localPolished);
            // Could add a toast notification here
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">AI Tekstverbetering</h3>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    {status === 'generating' && (
                        <span className="flex items-center gap-2 text-sm text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Genereren...
                        </span>
                    )}
                    {status === 'done' && (
                        <span className="flex items-center gap-2 text-sm text-green-600">
                            <Check className="w-4 h-4" />
                            Klaar
                        </span>
                    )}
                    {status === 'error' && (
                        <span className="flex items-center gap-2 text-sm text-red-600">
                            <X className="w-4 h-4" />
                            Fout
                        </span>
                    )}
                </div>
            </div>

            {/* Auto-polish Toggle */}
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={autoPolish}
                    onChange={(e) => setAutoPolish(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Auto-verbeteren bij opslaan</span>
            </label>

            {/* Raw Text Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ruwe beschrijving (origineel)
                </label>
                <textarea
                    value={rawText}
                    onChange={(e) => onTextChange(e.target.value, localPolished)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Typ hier je beschrijving..."
                />
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                        {rawText.length} karakters {!canGenerate && '(min. 30)'}
                    </span>
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={handlePolish}
                disabled={!canGenerate || status === 'generating'}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {status === 'generating' ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Tekst verbeteren...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        Verbeter tekst
                    </>
                )}
            </button>

            {/* Error Message */}
            {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            {/* Polished Text Output */}
            {(localPolished || status === 'done') && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Verbeterde beschrijving
                    </label>
                    <div className="relative">
                        <textarea
                            value={localPolished}
                            onChange={(e) => setLocalPolished(e.target.value)}
                            rows={8}
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg bg-purple-50/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Gegenereerde tekst verschijnt hier..."
                        />
                        <button
                            onClick={handleCopyToClipboard}
                            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                            title="Kopieer naar klembord"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-xs text-gray-500">
                        {localPolished.length} karakters
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleApply}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Check className="w-4 h-4" />
                            Toepassen
                        </button>
                        <button
                            onClick={handleRegenerate}
                            disabled={status === 'generating'}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Opnieuw genereren
                        </button>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="text-xs text-gray-500">
                💡 De AI verbetert je tekst professioneel zonder feiten toe te voegen
            </div>
        </div>
    );
}
