import React, { useEffect, useState } from 'react';
import { CameraPreview, CameraPreviewOptions } from '@capacitor-community/camera-preview';
import { usePlatform } from '../../hooks/usePlatform';
import { Aperture, Zap, Sun, Palette, Scan, Settings, Loader2, Camera, Images } from 'lucide-react';
import { LuxButton } from '../LuxButton';
import { MobileGalleryOverlay } from './MobileGalleryOverlay';

/**
 * MOBILE CAMERA VIEW ("PROCREW IN POCKET")
 * This component overlays React UI on top of the native Capacitor Camera Preview.
 * It simulates a professional camera interface where:
 * - Film Stock = StyleScaler
 * - Lighting/Flash = LightScaler
 * - Lens/Zoom = PhotoScaler
 */
export const MobileCameraView: React.FC = () => {
    const { isNative, isSimulated } = usePlatform();
    const [cameraActive, setCameraActive] = useState(false);
    const [processing, setProcessing] = useState(false);

    // AI Parameters (Mapped to Camera Metaphors)
    const [wbMode, setWbMode] = useState<'AUTO' | 'TUNGSTEN' | 'DAYLIGHT'>('AUTO'); // Maps to Style scaler
    const [exposure, setExposure] = useState(0); // Maps to Light scaler intensity

    useEffect(() => {
        // Only start REAL camera if native AND NOT simulated
        if (isNative && !isSimulated) {
            startCamera();
        } else if (isSimulated) {
            // In simulation, we pretend camera is active
            setCameraActive(true);
        }
        return () => {
            if (isNative && !isSimulated) stopCamera();
        };
    }, [isNative, isSimulated]);

    const startCamera = async () => {
        const cameraOptions: CameraPreviewOptions = {
            position: 'rear',
            parent: 'cameraPreview', // ID of the container
            className: 'cameraPreview',
            toBack: true, // Send native preview BEHIND the React webview (which must be transparent)
            width: window.screen.width,
            height: window.screen.height,
        };
        try {
            await CameraPreview.start(cameraOptions);
            setCameraActive(true);
        } catch (err) {
            console.error("Failed to start camera preview", err);
        }
    };

    const stopCamera = async () => {
        try {
            await CameraPreview.stop();
            setCameraActive(false);
        } catch (err) {
            // Ignore if already stopped
        }
    };

    const capturePhoto = async () => {
        if (processing) return;
        setProcessing(true);
        try {
            if (isSimulated) {
                // Mock capture for simulator
                console.log("📸 [SIMULATOR] Capture triggered");
                await new Promise(resolve => setTimeout(resolve, 800)); // Fake shutter lag
                // Could act here like we got a result
            } else {
                // Real Capture
                const result = await CameraPreview.capture({ quality: 90 });
                console.log("Captured base64 length:", result.value.length);
            }

            // Mock processing delay
            setTimeout(() => setProcessing(false), 2000);
        } catch (err) {
            console.error("Capture failed", err);
            setProcessing(false);
        }
    };

    return (
        // Main Container MUST be transparent to see camera behind
        <div className="relative w-full h-screen bg-transparent flex flex-col justify-between overflow-hidden">

            {/* SIMULATOR BACKGROUND (Only visible if simulated) */}
            {isSimulated && (
                <div className="absolute inset-0 z-[-1] bg-gray-900 flex items-center justify-center">
                    <div className="text-center opacity-30">
                        <Camera className="w-24 h-24 mx-auto mb-4" />
                        <p className="font-mono text-sm">SIMULATED CAMERA FEED</p>
                        <p className="text-xs">No native camera hardware detected</p>
                    </div>
                    {/* Optional: You could use a real <img> or <video> here for realism */}
                    <img
                        src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 contrast-125 grayscale"
                        alt="Simulator Feed"
                    />
                </div>
            )}

            {/* --- TOP BAR (Status & Settings) --- */}
            <div className="w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pt-12 pb-8 z-10">
                <div className="flex gap-4 text-white/80 items-center">
                    <Settings className="w-6 h-6" />
                    <span className="text-xs font-mono border border-white/30 px-2 py-1 rounded">RAW 32-BIT</span>
                    {/* SIMULATOR EXIT - Only visible on web */}
                    {!isNative || isSimulated ? (
                        <button
                            onClick={() => {
                                localStorage.removeItem('LUX_DEV_PLATFORM_OVERRIDE');
                                window.dispatchEvent(new Event('lux-platform-change'));
                            }}
                            className="ml-4 px-2 py-1 bg-crimson-glow text-white text-[10px] font-bold uppercase rounded animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                        >
                            Exit Sim
                        </button>
                    ) : null}
                </div>
                <div className="flex gap-4 text-[#D4AF37]">
                    <Zap className="w-6 h-6" />
                </div>
            </div>

            {/* --- CENTRAL FOCUS AREA (Reticle) --- */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border border-white/20 rounded-lg flex items-center justify-center relative">
                    <div className="w-4 h-0.5 bg-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="h-4 w-0.5 bg-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/50"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/50"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/50"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/50"></div>
                </div>
            </div>

            {/* --- CONTROLS OVERLAY --- */}
            <div className="w-full bg-gradient-to-t from-black via-black/80 to-transparent pb-12 pt-20 px-6 z-10 flex flex-col gap-8">

                {/* AI Wheels (Simulated Lens/Film Controls) */}
                <div className="flex justify-between items-center px-4">
                    {/* StyleScaler (Film Stock) */}
                    <div className="flex flex-col items-center gap-2">
                        <Palette className="w-6 h-6 text-white/70" />
                        <span className="text-[10px] uppercase tracking-widest text-white/50">Film</span>
                    </div>

                    {/* UpScaler (Detail) */}
                    <div className="flex flex-col items-center gap-2">
                        <Scan className="w-6 h-6 text-white/70" />
                        <span className="text-[10px] uppercase tracking-widest text-white/50">Detail</span>
                    </div>

                    {/* LightScaler (Exposure) */}
                    <div className="flex flex-col items-center gap-2">
                        <Sun className="w-6 h-6 text-white/70" />
                        <span className="text-[10px] uppercase tracking-widest text-white/50">Light</span>
                    </div>
                </div>

                {/* Shutter Button */}
                <div className="flex items-center justify-center relative">
                    <button
                        onClick={capturePhoto}
                        disabled={processing}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <div className={`w-16 h-16 rounded-full ${processing ? 'bg-[#D4AF37] animate-pulse' : 'bg-white'}`} />
                    </button>
                    {processing && (
                        <div className="absolute -top-12 bg-black/50 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                            <span className="text-xs text-white uppercase tracking-widest">Processing</span>
                        </div>
                    )}
                </div>

            </div>
            {/* ENVIRONMENT BADGE - MOBILE APP */}
            <div className="fixed bottom-4 right-4 z-[999] bg-black/80 backdrop-blur border border-[#D4AF37]/30 px-3 py-1.5 rounded-full shadow-2xl pointer-events-none flex items-center gap-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
                <span className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest">
                    {isSimulated ? "📱 APP SIMULATION (BROWSER)" : "📱 NATIVE APP (DEVICE)"}
                </span>
            </div>
        </div>
    );
};
