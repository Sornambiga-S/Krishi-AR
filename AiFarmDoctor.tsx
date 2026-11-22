import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, DiseaseInfo, PlantIdentificationResult, CropInfo } from '../types';
import { SAMPLE_LEAVES, CROPS_DATABASE, DISEASE_DATABASE } from '../data/mockData';
import { aiService, AnalysisPipelineStep, AiDiagnosisResult } from '../services/aiService';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Glasses, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw, 
  Info, 
  RotateCcw, 
  Search, 
  MapPin, 
  SwitchCamera, 
  XCircle, 
  Check, 
  Sun, 
  Droplet, 
  Thermometer, 
  Calendar, 
  Wheat, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Sliders
} from 'lucide-react';
import { playClick, playScanBeep, playSuccessChime } from '../utils/audio';

interface AiFarmDoctorProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectDiseaseForAr: (disease: DiseaseInfo) => void;
  onRecordScanActivity: (crop: string, disease: string) => void;
  onCollectDiamond?: (amount: number, reason: string) => void;
  selectedCropForDoctor?: string | null;
}

export const AiFarmDoctor: React.FC<AiFarmDoctorProps> = ({
  setActiveTab,
  onSelectDiseaseForAr,
  onRecordScanActivity,
  onCollectDiamond,
  selectedCropForDoctor
}) => {
  // Main Doctor Mode: 'identify' (Camera Plant Identification - 50 Plants) vs 'disease' (Pathology Screening)
  const [primaryMode, setPrimaryMode] = useState<'identify' | 'disease'>('identify');

  // Input source mode for Identification: 'camera' | 'upload' | 'samples'
  const [inputSource, setInputSource] = useState<'camera' | 'upload' | 'samples'>('camera');

  // Camera states
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Gallery upload states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // 50 Plants Sample Browser filters
  const [selectedPlantCategory, setSelectedPlantCategory] = useState<string>('All');
  const [plantSearchTerm, setPlantSearchTerm] = useState<string>('');

  // Identification State
  const [isIdentifying, setIsIdentifying] = useState<boolean>(false);
  const [plantResult, setPlantResult] = useState<PlantIdentificationResult | null>(null);

  // Disease Diagnosis State (for disease mode)
  const [selectedLeafId, setSelectedLeafId] = useState<string>('tomato-early-blight');
  const [isAnalyzingDisease, setIsAnalyzingDisease] = useState<boolean>(false);
  const [currentDiseaseStep, setCurrentDiseaseStep] = useState<AnalysisPipelineStep | null>(null);
  const [diseaseResult, setDiseaseResult] = useState<AiDiagnosisResult | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const plantCategories = [
    'All',
    'Food and Field Crops',
    'Vegetables',
    'Fruits and Fruit Trees',
    'Flowers, Medicinal and Other Plants'
  ];

  // Stop camera tracks helper
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraLoading(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // When navigated from CropExplorer with a selected crop
  useEffect(() => {
    if (selectedCropForDoctor) {
      setPrimaryMode('identify');
      const matched = CROPS_DATABASE.find(
        (c) => c.name.toLowerCase() === selectedCropForDoctor.toLowerCase() || c.id === selectedCropForDoctor.toLowerCase()
      );
      if (matched) {
        runPlantIdentification(undefined, `${matched.id}-sample-leaf.jpg`, matched.id);
      }
    }
  }, [selectedCropForDoctor]);

  // Request & Start Camera
  const startCamera = async (overrideFacing?: 'environment' | 'user') => {
    playClick();
    setCameraError(null);
    setCameraLoading(true);
    setCapturedImage(null);
    stopCameraStream();

    const mode = overrideFacing || facingMode;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser. Please use Gallery Upload.');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (err) {
        console.warn('Requested facingMode failed, falling back to basic video constraint:', err);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.warn('Video play error:', e));
          setCameraActive(true);
          setCameraLoading(false);
        };
      } else {
        setCameraActive(true);
        setCameraLoading(false);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      stopCameraStream();
      let errorMsg = 'Unable to access camera on this device.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission denied. Please enable camera permissions in browser settings or upload from gallery.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera hardware found. You can upload an image from your device gallery.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setCameraError(errorMsg);
    }
  };

  // Switch between rear and front camera
  const toggleCameraFacing = () => {
    playClick();
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  // Capture photo from live stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    playScanBeep();

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
      stopCameraStream();

      // Trigger automatic identification
      runPlantIdentification(dataUrl, 'live-camera-captured.jpg');
    }
  };

  // Retake photo / start camera again
  const retakePhoto = () => {
    playClick();
    setCapturedImage(null);
    setPlantResult(null);
    setInputSource('camera');
    startCamera();
  };

  // Identify Again
  const handleIdentifyAgain = () => {
    playClick();
    setPlantResult(null);
    setCapturedImage(null);
    setUploadedImage(null);
    setInputSource('camera');
    startCamera();
  };

  // Process uploaded image file
  const handleFileProcess = (file: File) => {
    if (!file) return;
    playClick();
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
      // Automatically identify uploaded plant
      runPlantIdentification(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Core Plant Identification runner
  const runPlantIdentification = async (
    image?: string,
    fileName?: string,
    plantId?: string,
    simulateBlurry?: boolean,
    simulateUnsupported?: boolean
  ) => {
    setIsIdentifying(true);
    setPlantResult(null);
    playScanBeep();

    try {
      const result = await aiService.identifyPlant(
        image,
        fileName,
        plantId,
        simulateBlurry,
        simulateUnsupported
      );
      setPlantResult(result);
      setIsIdentifying(false);

      if (result.status === 'identified') {
        playSuccessChime();
        if (onCollectDiamond) {
          onCollectDiamond(1, `Identified ${result.plantName}!`);
        }
      }
    } catch (err) {
      console.error('Plant identification failed:', err);
      setIsIdentifying(false);
    }
  };

  // Disease analysis runner (for disease screening mode)
  const runDiseaseAnalysis = async (leafId: string = 'tomato-early-blight', customImage?: string, fileName?: string) => {
    setSelectedLeafId(leafId);
    setIsAnalyzingDisease(true);
    setDiseaseResult(null);
    playScanBeep();

    try {
      const result = await aiService.analyzePlantImage(
        leafId,
        (step) => setCurrentDiseaseStep(step),
        customImage,
        fileName
      );
      setDiseaseResult(result);
      setIsAnalyzingDisease(false);
      playSuccessChime();
      onRecordScanActivity(result.cropName, result.diseaseName);
    } catch (err) {
      console.error('Disease analysis failed:', err);
      setIsAnalyzingDisease(false);
    }
  };

  // Filter 50 plants for sample drawer
  const filteredCrops = CROPS_DATABASE.filter((crop) => {
    const matchesCat = selectedPlantCategory === 'All' || crop.category === selectedPlantCategory;
    const term = plantSearchTerm.toLowerCase();
    const matchesSearch = 
      crop.name.toLowerCase().includes(term) ||
      crop.scientificName.toLowerCase().includes(term) ||
      (crop.tamilName && crop.tamilName.toLowerCase().includes(term)) ||
      (crop.majorTNRegions && crop.majorTNRegions.some((r) => r.toLowerCase().includes(term)));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>NEURAL AGRICULTURAL SYSTEM · 50 TAMIL NADU PLANTS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            🤖 AI Farm Doctor & Plant Identifier
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl">
            Real-time camera and gallery identification across 50 Tamil Nadu food crops, vegetables, fruits, and medicinal plants, with automated disease screening.
          </p>
        </div>

        {/* Primary Feature Tabs: Plant Identification vs Disease Diagnosis */}
        <div className="flex items-center p-1.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 self-start md:self-auto">
          <button
            onClick={() => {
              playClick();
              setPrimaryMode('identify');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              primaryMode === 'identify'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 scale-102'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>🌿 Identify Plant (50 Plants)</span>
          </button>
          <button
            onClick={() => {
              playClick();
              setPrimaryMode('disease');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              primaryMode === 'disease'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 scale-102'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>🔬 Diagnose Disease</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: CAMERA-BASED PLANT IDENTIFICATION (50 PLANTS)
      ========================================================================== */}
      {primaryMode === 'identify' && (
        <div className="space-y-6">
          
          {/* Input Source Selector & Sub-controls */}
          <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-emerald-500/25 shadow-2xl space-y-6 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Option A: Live Camera */}
                <button
                  onClick={() => {
                    setInputSource('camera');
                    startCamera();
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                    inputSource === 'camera'
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                      : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>📷 Live Camera Scan</span>
                </button>

                {/* Option B: Gallery Upload */}
                <button
                  onClick={() => {
                    playClick();
                    stopCameraStream();
                    setInputSource('upload');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                    inputSource === 'upload'
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                      : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>🖼️ Upload from Gallery</span>
                </button>

                {/* Option C: 50 Plants Catalog */}
                <button
                  onClick={() => {
                    playClick();
                    stopCameraStream();
                    setInputSource('samples');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                    inputSource === 'samples'
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                      : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
                  }`}
                >
                  <Wheat className="w-4 h-4" />
                  <span>🌾 Select from 50 Crops</span>
                </button>
              </div>

              {/* Threshold Testing Simulation Badges */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="text-emerald-400/80 mr-1 hidden sm:inline">Model Testing:</span>
                <button
                  onClick={() => runPlantIdentification(undefined, 'blurry_unfocused_specimen.jpg', undefined, true, false)}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50 transition-colors"
                  title="Test low confidence (<70%) threshold"
                >
                  ⚠️ Test Blurry Image (&lt;70%)
                </button>
                <button
                  onClick={() => runPlantIdentification(undefined, 'non_plant_building_car.jpg', undefined, false, true)}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 transition-colors"
                  title="Test unsupported plant rejection"
                >
                  🚫 Test Unsupported Object
                </button>
              </div>
            </div>

            {/* A. Live Camera Stream / Viewfinder */}
            {inputSource === 'camera' && (
              <div className="space-y-4">
                {cameraError && (
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3">
                    <div className="flex items-start space-x-3 text-rose-300">
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Camera Access Error</h4>
                        <p className="text-xs text-rose-200/90 mt-0.5">{cameraError}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-8">
                      <button
                        onClick={() => startCamera()}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                      >
                        🔄 Retry Camera
                      </button>
                      <button
                        onClick={() => setInputSource('upload')}
                        className="px-3.5 py-1.5 rounded-xl glass-card border border-emerald-400/30 text-xs text-emerald-200"
                      >
                        🖼️ Switch to Gallery
                      </button>
                    </div>
                  </div>
                )}

                {/* Viewfinder Window */}
                {!cameraError && !capturedImage && (
                  <div className="relative rounded-2xl overflow-hidden bg-black/90 border-2 border-emerald-500/40 aspect-video max-h-[460px] flex items-center justify-center shadow-2xl">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted
                      className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
                    />

                    {cameraLoading && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-3 z-20">
                        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                        <p className="text-xs font-mono text-emerald-300">Initializing Optical Camera Stream...</p>
                      </div>
                    )}

                    {cameraActive && (
                      <>
                        {/* HUD Framing Brackets */}
                        <div className="absolute inset-6 sm:inset-12 pointer-events-none">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg"></div>
                          <div className="w-full h-full border border-emerald-500/20 rounded-lg ar-grid opacity-40"></div>
                        </div>

                        {/* Top Status */}
                        <div className="absolute top-4 left-4 flex items-center space-x-2 text-[10px] font-mono text-emerald-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/30">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          <span>LIVE CAMERA · 50 CROPS RECOGNIZER</span>
                        </div>

                        <div className="absolute top-4 right-4">
                          <button
                            onClick={toggleCameraFacing}
                            className="p-2 rounded-xl bg-black/70 backdrop-blur-md border border-emerald-500/30 text-emerald-300 hover:text-white text-xs flex items-center space-x-1"
                            title="Flip Camera (Front/Rear)"
                          >
                            <SwitchCamera className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Flip</span>
                          </button>
                        </div>

                        {/* Center Reticle */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-20 h-20 border border-emerald-400/50 rounded-full flex items-center justify-center animate-pulse">
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
                          </div>
                        </div>

                        {/* Bottom Shutter Button */}
                        <div className="absolute bottom-5 inset-x-0 flex flex-col items-center justify-center space-y-1.5 z-10">
                          <button
                            onClick={capturePhoto}
                            className="p-1 rounded-full bg-white/20 border-2 border-emerald-400 hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                            title="Capture Real-Time Plant Image"
                          >
                            <div className="w-14 h-14 rounded-full bg-emerald-400 hover:bg-emerald-300 flex items-center justify-center text-black font-extrabold shadow-inner">
                              <Camera className="w-6 h-6 text-black" />
                            </div>
                          </button>
                          <span className="text-[10px] font-mono text-emerald-200 bg-black/70 px-3 py-0.5 rounded-full border border-emerald-500/30">
                            Tap to capture & identify leaf
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* B. Gallery Image Upload */}
            {inputSource === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileProcess(file);
                  }}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) handleFileProcess(file);
                  }}
                  className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-emerald-400 bg-emerald-950/60 scale-[1.01]'
                      : 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400/70 hover:bg-emerald-950/40'
                  }`}
                >
                  <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Upload plant or leaf photo from gallery
                  </h3>
                  <p className="text-xs text-emerald-300/70 mt-1 max-w-md mx-auto leading-relaxed">
                    Select a photo of any of the 50 Tamil Nadu crops from your device gallery. Supports JPG, PNG, WEBP.
                  </p>
                  <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-bold text-emerald-300">
                    <span>📁 Choose Image File</span>
                  </div>
                </div>
              </div>
            )}

            {/* C. 50 Plants Sample Selector Drawer */}
            {inputSource === 'samples' && (
              <div className="space-y-4">
                {/* Search & Category Pills */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {plantCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          playClick();
                          setSelectedPlantCategory(cat);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedPlantCategory === cat
                            ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                            : 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/20 hover:border-emerald-400/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-64">
                    <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={plantSearchTerm}
                      onChange={(e) => setPlantSearchTerm(e.target.value)}
                      placeholder="Search 50 crops, Tamil name..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-input text-xs placeholder-emerald-500/60"
                    />
                  </div>
                </div>

                {/* 50 Plants Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {filteredCrops.map((crop) => (
                    <button
                      key={crop.id}
                      onClick={() => runPlantIdentification(undefined, `${crop.id}-sample-leaf.jpg`, crop.id)}
                      className="p-3 rounded-2xl glass-card border border-emerald-500/20 hover:border-emerald-400/60 hover:scale-[1.02] text-left transition-all space-y-1 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl p-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
                          {crop.icon}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 truncate max-w-[80px]">
                          {crop.category.split(' ')[0]}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white truncate">{crop.name}</div>
                        {crop.tamilName && (
                          <div className="text-[10px] font-semibold text-lime-300 truncate">{crop.tamilName}</div>
                        )}
                        <div className="text-[9px] italic text-emerald-300/70 font-mono truncate">{crop.scientificName}</div>
                      </div>
                      <div className="pt-1 text-[9px] text-emerald-400 font-semibold flex items-center justify-between">
                        <span>Identify</span>
                        <span>→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Identification In-Progress Animation */}
          {isIdentifying && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-400/40 shadow-2xl space-y-4 text-left animate-in fade-in duration-300">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                <div>
                  <h3 className="text-lg font-bold text-white">Identifying plant species...</h3>
                  <p className="text-xs text-emerald-300/80 font-mono">
                    Vision Transformer (ViT-B/16) extracting foliar margins, venation patterns, and chlorophyll signatures across 50 Tamil Nadu botanical classes...
                  </p>
                </div>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden border border-emerald-500/20">
                <div className="bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-300 h-full animate-pulse w-3/4 rounded-full"></div>
              </div>
            </div>
          )}

          {/* =========================================================================
              PLANT IDENTIFICATION RESULT DISPLAY
          ========================================================================== */}
          {plantResult && !isIdentifying && (
            <div className="space-y-6 animate-in fade-in duration-500 text-left">
              
              {/* Result Status Card */}
              <div className={`glass-panel rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden ${
                plantResult.status === 'identified'
                  ? 'border-emerald-500/50'
                  : plantResult.status === 'low_confidence'
                  ? 'border-amber-500/50'
                  : 'border-rose-500/50'
              }`}>
                
                {/* Background ambient glow */}
                <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -z-10 ${
                  plantResult.status === 'identified'
                    ? 'bg-emerald-500/10'
                    : plantResult.status === 'low_confidence'
                    ? 'bg-amber-500/10'
                    : 'bg-rose-500/10'
                }`}></div>

                {/* Grid: Preview & Classification */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Image Preview */}
                  <div className="lg:col-span-4">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400/40 bg-black aspect-video sm:aspect-square flex items-center justify-center shadow-xl">
                      {plantResult.capturedImage ? (
                        <img 
                          src={plantResult.capturedImage} 
                          alt="Captured plant preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-6 space-y-2">
                          <span className="text-6xl">
                            {CROPS_DATABASE.find(c => c.id === plantResult.plantId)?.icon || '🌿'}
                          </span>
                          <div className="text-xs font-mono text-emerald-300">BOTANICAL SPECIMEN</div>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-300 border border-emerald-500/30">
                        INPUT_PREVIEW
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Details & Status */}
                  <div className="lg:col-span-5 space-y-3.5">
                    
                    {/* Status Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      {plantResult.status === 'identified' && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-xs font-mono text-lime-300 font-bold flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>PLANT IDENTIFIED · 50 CROPS CATALOG</span>
                        </span>
                      )}
                      {plantResult.status === 'low_confidence' && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-mono text-amber-300 font-bold flex items-center space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>LOW CONFIDENCE PREDICTION</span>
                        </span>
                      )}
                      {plantResult.status === 'unsupported' && (
                        <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-xs font-mono text-rose-300 font-bold flex items-center space-x-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>UNSUPPORTED SPECIMEN</span>
                        </span>
                      )}
                      {plantResult.backendEngine && (
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-950/60 border border-teal-500/30 text-[10px] font-mono text-teal-300">
                          ⚡ {plantResult.backendEngine}
                        </span>
                      )}
                    </div>

                    {/* Plant Names in English and Tamil */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex flex-wrap items-baseline gap-2">
                        <span>{plantResult.plantName}</span>
                        {plantResult.tamilName && (
                          <span className="text-xl font-bold text-lime-300 font-sans">
                            ({plantResult.tamilName})
                          </span>
                        )}
                      </h2>
                      <div className="text-xs sm:text-sm italic font-mono text-emerald-300/80 mt-0.5">
                        {plantResult.scientificName} · {plantResult.category}
                      </div>
                    </div>

                    {/* Status Explanation Message */}
                    {plantResult.status === 'low_confidence' && (
                      <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                        <strong>Plant Not Identified – Please Capture a Clear Image.</strong>
                        <p className="mt-1">
                          The confidence level is below the acceptable 70% threshold ({plantResult.confidence}%). Foliar edges appear blurry or insufficiently lit.
                        </p>
                      </div>
                    )}

                    {plantResult.status === 'unsupported' && (
                      <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200/90 leading-relaxed">
                        <strong>Unsupported Plant.</strong>
                        <p className="mt-1">
                          This specimen does not match any of the 50 supported Tamil Nadu agricultural crops. To maintain reliable academic integrity, KrishiAR will never guess randomly.
                        </p>
                      </div>
                    )}

                    {/* Quick highlights if identified */}
                    {plantResult.status === 'identified' && (
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                          <span className="text-emerald-400 text-[10px] font-mono">GROWTH PERIOD</span>
                          <div className="font-semibold text-white mt-0.5">{plantResult.suitableConditions.growthPeriod}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                          <span className="text-emerald-400 text-[10px] font-mono">WATER NEED</span>
                          <div className="font-semibold text-white mt-0.5">{plantResult.suitableConditions.waterNeed}</div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column: AI Confidence Gauge & Retake Options */}
                  <div className="lg:col-span-3 flex flex-col items-center justify-center p-3 space-y-4">
                    
                    {/* Confidence Gauge */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          className="text-emerald-950/80"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          className={`transition-all duration-1000 ease-out ${
                            plantResult.confidence >= 70 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 50}
                          strokeDashoffset={2 * Math.PI * 50 * (1 - plantResult.confidence / 100)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-extrabold font-mono text-white">
                          {plantResult.confidence}%
                        </span>
                        <span className="text-[9px] uppercase font-mono tracking-wider text-emerald-300">
                          Confidence
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Retake and Identify Again */}
                    <div className="w-full space-y-2">
                      <button
                        onClick={retakePhoto}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 hover:scale-102 active:scale-95 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Photo</span>
                      </button>

                      <button
                        onClick={handleIdentifyAgain}
                        className="w-full py-2 px-3 rounded-xl glass-card border border-emerald-400/30 text-emerald-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Identify Another Plant</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* =========================================================================
                  PLANT INFORMATION SECTION (Organized & Easy to Understand)
              ========================================================================== */}
              {plantResult.status === 'identified' && (
                <div className="space-y-6">
                  
                  {/* Section Title */}
                  <div className="border-b border-emerald-500/20 pb-2">
                    <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                      <span>📖 Comprehensive Plant Information Profile</span>
                    </h3>
                    <p className="text-xs text-emerald-300/80">
                      Standardized botanical, agronomic, and cultivation guidelines for {plantResult.plantName} in Tamil Nadu:
                    </p>
                  </div>

                  {/* 1. Suitable Growing Conditions */}
                  <div className="p-5 rounded-2xl glass-panel border border-emerald-500/25 space-y-4">
                    <h4 className="text-xs font-mono font-bold text-lime-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Suitable Growing Conditions (TNAU Guidelines)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
                        <div className="font-semibold text-emerald-300 flex items-center space-x-1.5">
                          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                          <span>Optimal Temperature:</span>
                        </div>
                        <div className="text-emerald-100/90">{plantResult.suitableConditions.optimalTemperature}</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
                        <div className="font-semibold text-emerald-300 flex items-center space-x-1.5">
                          <Droplet className="w-3.5 h-3.5 text-teal-400" />
                          <span>Water Requirement:</span>
                        </div>
                        <div className="text-emerald-100/90">{plantResult.suitableConditions.waterNeed} Need</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
                        <div className="font-semibold text-emerald-300 flex items-center space-x-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-300" />
                          <span>Sunlight Requirement:</span>
                        </div>
                        <div className="text-emerald-100/90">{plantResult.suitableConditions.sunlight}</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 space-y-1 sm:col-span-2">
                        <div className="font-semibold text-emerald-300 flex items-center space-x-1.5">
                          <Wheat className="w-3.5 h-3.5 text-lime-400" />
                          <span>Recommended Soil Profile:</span>
                        </div>
                        <div className="text-emerald-100/90">{plantResult.suitableConditions.soilType}</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
                        <div className="font-semibold text-emerald-300 flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-lime-400" />
                          <span>Growth Period:</span>
                        </div>
                        <div className="text-emerald-100/90">{plantResult.suitableConditions.growthPeriod}</div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Basic Cultivation Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Cultivation Practices */}
                    <div className="p-5 rounded-2xl glass-panel border border-emerald-500/25 space-y-3">
                      <h4 className="text-xs font-mono font-bold text-lime-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Basic Cultivation Practices</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-emerald-100/90">
                        {plantResult.cultivationInfo.basicPractices.map((practice, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Regions & Harvest Yield */}
                    <div className="space-y-4">
                      {/* Yield */}
                      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                          Expected Harvest Yield
                        </span>
                        <div className="text-sm font-bold text-white">
                          {plantResult.cultivationInfo.harvestYield}
                        </div>
                      </div>

                      {/* Major Regions */}
                      {plantResult.cultivationInfo.majorTNRegions.length > 0 && (
                        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>Major Tamil Nadu Districts</span>
                          </span>
                          <div className="text-xs text-emerald-100/90">
                            {plantResult.cultivationInfo.majorTNRegions.join(', ')}
                          </div>
                        </div>
                      )}

                      {/* Fun Fact */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-500/30 flex items-start space-x-2.5">
                        <Sparkles className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-200/90 leading-relaxed italic">
                          "{plantResult.cultivationInfo.funFact}"
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Quick CTAs: Check Disease or AR */}
                  <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-emerald-200">
                      Want to check this plant for diseases or view in 3D AR?
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          playClick();
                          setPrimaryMode('disease');
                          runDiseaseAnalysis('auto', plantResult.capturedImage, `${plantResult.plantId}.jpg`);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md flex items-center space-x-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-black" />
                        <span>Check Plant Health / Disease →</span>
                      </button>
                      <button
                        onClick={() => {
                          playClick();
                          setActiveTab('crop-explorer');
                        }}
                        className="px-4 py-2 rounded-xl glass-card border border-emerald-400/30 text-emerald-200 text-xs font-semibold hover:text-white"
                      >
                        🌾 View All 50 Crops in Explorer
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          SECTION 2: PLANT DISEASE & HEALTH DIAGNOSIS (Existing Deep Pathology Engine)
      ========================================================================== */}
      {primaryMode === 'disease' && (
        <div className="space-y-6">
          
          {/* Quick Preset Selector for Disease Diagnosis */}
          <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-emerald-500/25 shadow-2xl space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  🔬 Agricultural Pathology Screening (ResNet-50 + TNAU Knowledge Base)
                </h3>
                <p className="text-xs text-emerald-300/80">
                  Select an infected plant sample to analyze symptoms, pathogen biology, and 15-day progression:
                </p>
              </div>
              <button
                onClick={() => setPrimaryMode('identify')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-xs font-semibold text-emerald-300 hover:text-white self-start"
              >
                ← Back to Plant Identifier
              </button>
            </div>

            {/* Quick 10 Samples Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              {SAMPLE_LEAVES.slice(0, 10).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => runDiseaseAnalysis(sample.id)}
                  className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between group ${
                    selectedLeafId === sample.id
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-lg scale-[1.02]'
                      : 'glass-card border-emerald-500/20 hover:border-emerald-400/50 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl p-1 rounded-xl bg-emerald-950/70 border border-emerald-500/30">
                      {sample.imageThumbnail}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      {sample.category.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white truncate">{sample.title}</div>
                    <div className="text-[10px] text-lime-300 truncate">{sample.tamilCropName}</div>
                    <div className="text-[10px] text-amber-300 font-mono truncate mt-0.5">🦠 {sample.disease}</div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-emerald-500/15 text-[10px] font-semibold text-emerald-400 flex items-center justify-between">
                    <span>Screen</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>

          </div>

          {/* Disease Pipeline Progress Indicator */}
          {isAnalyzingDisease && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-400/40 shadow-2xl space-y-4 text-left animate-in fade-in duration-300">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                <div>
                  <h3 className="text-lg font-bold text-white">Analyzing foliar pathogen...</h3>
                  <p className="text-xs text-emerald-300/80 font-mono">
                    {currentDiseaseStep ? currentDiseaseStep.label : 'Initializing neural weights & TNAU pathology database...'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden border border-emerald-500/20">
                <div className="bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-300 h-full animate-pulse w-4/5 rounded-full"></div>
              </div>
            </div>
          )}

          {/* Disease Diagnosis Results Card */}
          {diseaseResult && !isAnalyzingDisease && (
            <div className="space-y-6 animate-in fade-in duration-500 text-left">
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 relative overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Crop, Disease, Health */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>AI SCREENING REPORT GENERATED · TAMIL NADU CROPS MODEL</span>
                    </div>

                    <div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white flex flex-wrap items-baseline gap-2">
                        <span>Crop: {diseaseResult.cropName}</span>
                        {diseaseResult.tamilCropName && (
                          <span className="text-xl font-bold text-lime-300 font-sans">
                            ({diseaseResult.tamilCropName})
                          </span>
                        )}
                        <span className="text-base font-normal italic text-emerald-300/70">
                          ({diseaseResult.cropScientificName})
                        </span>
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                        <span className="text-[11px] uppercase tracking-wider text-emerald-400/80 font-mono">
                          Possible Condition
                        </span>
                        <div className="text-base font-bold text-white mt-0.5">
                          {diseaseResult.diseaseName}
                        </div>
                        {diseaseResult.tamilName && (
                          <div className="text-xs font-semibold text-lime-300 mt-0.5">
                            {diseaseResult.tamilName}
                          </div>
                        )}
                        <div className="text-[11px] italic text-emerald-300/70">
                          {diseaseResult.scientificName}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-amber-500/30">
                        <span className="text-[11px] uppercase tracking-wider text-amber-400/80 font-mono">
                          Plant Health
                        </span>
                        <div className="text-base font-bold text-amber-300 mt-0.5 flex items-center space-x-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{diseaseResult.healthStatus}</span>
                        </div>
                        <div className="text-[11px] text-amber-200/70">
                          Severity: {diseaseResult.severity}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                        <span className="text-[11px] uppercase tracking-wider text-emerald-400/80 font-mono">
                          Major TN Belts
                        </span>
                        <div className="text-xs font-semibold text-emerald-200 mt-0.5 truncate">
                          {diseaseResult.majorTNRegions?.slice(0, 3).join(', ') || 'Tamil Nadu Agricultural Tracts'}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400/70 mt-0.5">
                          Latency: {diseaseResult.modelMetadata.inferenceTimeMs}ms
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-400/25 flex items-center space-x-2.5 text-xs text-emerald-300">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>Academic Disclaimer:</strong> AI foliar screening for educational demonstration.
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Confidence and AR CTA */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 space-y-4">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          className="text-emerald-950/80"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          className="text-emerald-400 transition-all duration-1000 ease-out"
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 50}
                          strokeDashoffset={2 * Math.PI * 50 * (1 - diseaseResult.confidence / 100)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-extrabold font-mono text-white">
                          {diseaseResult.confidence}%
                        </span>
                        <span className="text-[9px] uppercase font-mono tracking-wider text-emerald-300">
                          AI Confidence
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playClick();
                        onSelectDiseaseForAr(diseaseResult.diseaseInfo);
                        setActiveTab('ar-learning');
                      }}
                      className="w-full max-w-xs px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-black font-extrabold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Glasses className="w-5 h-5 text-black" />
                      <span>Explain with AR</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* Disease Symptoms & Pathogen Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl glass-card border border-rose-500/25 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-base">
                    <span className="p-1 rounded-lg bg-rose-500/20 text-rose-300">🔴</span>
                    <h4>Visible Symptoms</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-100/90 list-disc list-inside">
                    {diseaseResult.diseaseInfo.symptoms.map((sym, idx) => (
                      <li key={idx} className="leading-relaxed">{sym}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-amber-500/25 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
                    <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300">🦠</span>
                    <h4>Pathogen Cause</h4>
                  </div>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    {diseaseResult.diseaseInfo.cause}
                  </p>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-lime-500/25 space-y-3">
                  <div className="flex items-center space-x-2 text-lime-400 font-bold text-base">
                    <span className="p-1 rounded-lg bg-lime-500/20 text-lime-300">🌱</span>
                    <h4>Plant Impact & Physiology</h4>
                  </div>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    {diseaseResult.diseaseInfo.plantImpact}
                  </p>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-teal-500/25 space-y-3">
                  <div className="flex items-center space-x-2 text-teal-400 font-bold text-base">
                    <span className="p-1 rounded-lg bg-teal-500/20 text-teal-300">🛡️</span>
                    <h4>Prevention & Cultural Management</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-100/90 list-disc list-inside">
                    {diseaseResult.diseaseInfo.prevention.map((prev, idx) => (
                      <li key={idx} className="leading-relaxed">{prev}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Transition to Time Machine */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-emerald-200">
                  Explore chronological disease progression across 15 days or consult the AI Agronomist:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      playClick();
                      onSelectDiseaseForAr(diseaseResult.diseaseInfo);
                      setActiveTab('time-machine');
                    }}
                    className="px-3.5 py-1.5 rounded-lg glass-card border border-emerald-400/30 text-xs font-semibold text-emerald-200 flex items-center space-x-1.5 hover:text-white"
                  >
                    <Clock className="w-3.5 h-3.5 text-lime-400" />
                    <span>Disease Time Machine</span>
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      setActiveTab('ask-ai');
                    }}
                    className="px-3.5 py-1.5 rounded-lg glass-card border border-emerald-400/30 text-xs font-semibold text-emerald-200 flex items-center space-x-1.5 hover:text-white"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ask KrishiAR</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
