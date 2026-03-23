import React, { useState, useRef } from "react";
import { useImageUpload } from "./hooks/useImageUpload";
import { downloadDataURL } from "./utils/fileHelpers";
import SquareCropper from "./components/SquareCropper";
import { Upload, Download, ImageIcon, Settings2, Sparkles, Image as ImageIconLucide } from "lucide-react";

function App() {
  const { image, handleImageChange, resetImage, isUploading, error } = useImageUpload();
  const [cropData, setCropData] = useState(null);
  const [resolution, setResolution] = useState(1080);
  const [isDragging, setIsDragging] = useState(false);
  const cropperRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e);
  };

  const handleCropComplete = (data) => {
    setCropData(data);
  };

  const handleDownload = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas({
        width: resolution,
        height: resolution
      });
      
      if (canvas) {
        downloadDataURL(canvas.toDataURL("image/png"), `onebyone-${resolution}x${resolution}.png`);
      }
    }
  };

  const onReset = () => {
    resetImage();
    setCropData(null);
  };

  const handleResolutionChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setResolution("");
    } else {
      setResolution(Math.min(5000, Math.max(1, value)));
    }
  };

  return (
    <div 
      className="min-h-screen bg-white md:bg-[#fbfcfd] p-4 md:p-8 lg:p-12 flex flex-col items-center relative overflow-x-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-indigo-600/90 backdrop-blur-sm flex flex-col items-center justify-center border-[10px] border-dashed border-white/20 m-4 rounded-[40px] transition-all duration-300 pointer-events-none">
          <div className="bg-white/10 p-10 rounded-full animate-bounce">
            <Upload className="w-24 h-24 text-white" strokeWidth={3} />
          </div>
          <h2 className="text-white text-4xl font-black mt-8 tracking-tight">DROP YOUR IMAGE</h2>
          <p className="text-indigo-100 mt-4 font-bold text-lg">OneByOne will handle the rest</p>
        </div>
      )}

      <header className="w-full max-w-7xl mb-8 md:mb-12 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-xl flex-shrink-0">
            <ImageIconLucide className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">One By One</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Sparkles className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PRO IMAGE TOOLS</p>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="bg-white/50 border border-slate-100 px-4 py-2 rounded-full backdrop-blur-sm">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fast • Secure • 1:1 Precise</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl md:rounded-[40px] shadow-[0_40px_100px_rgba(8,112,184,0.06)] border border-slate-100 overflow-hidden flex flex-col">
          {!image ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 text-center min-h-[60vh]">
              <div className="relative mb-12 animate-bounce-subtle">
                <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[30px] flex items-center justify-center shadow-indigo-300 shadow-2xl transition-all duration-500">
                  <Upload className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
              
              <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Drop your masterpiece</h3>
              <p className="text-slate-500 mb-10 max-w-md font-medium text-lg leading-relaxed">
                Experience high-precision 1:1 cropping with our professional toolkit. Just upload and go.
              </p>
              
              <label className="group relative cursor-pointer inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                Browse Files
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              
              {error && (
                <div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl font-bold text-sm">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* Workspace - Takes 8 columns */}
              <div className="lg:col-span-8 p-4 md:p-8 bg-[#fcfdfe]">
                <div className="h-full w-full min-h-[400px] md:min-h-[500px]">
                  <SquareCropper 
                    ref={cropperRef}
                    image={image} 
                    onCropComplete={handleCropComplete} 
                    onReset={onReset}
                  />
                </div>
              </div>
              
              {/* Control Panel - Takes 4 columns */}
              <div className="lg:col-span-4 bg-white flex flex-col p-6 md:p-8 space-y-8">
                {/* Settings Section */}
                <section>
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="bg-indigo-50 p-2 rounded-lg">
                      <Settings2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-[0.15em]">Canvas Config</h3>
                  </div>
                  
                  <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-5">
                    <div>
                      <label htmlFor="resolution" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Target Resolution
                      </label>
                      <div className="relative">
                        <input
                          id="resolution"
                          type="number"
                          value={resolution}
                          onChange={handleResolutionChange}
                          onBlur={() => {
                            const val = parseInt(resolution);
                            if (isNaN(val) || val < 100) setResolution(100);
                            if (val > 5000) setResolution(5000);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-lg font-extrabold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                          <div className="w-px h-4 bg-slate-200"></div>
                          <span className="text-slate-300 font-black text-[10px] tracking-tighter uppercase">
                            PX
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {[100, 512, 1080, 1500, 2048].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setResolution(preset)}
                            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                              resolution === preset 
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                              : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                          >
                            {preset === 100 ? "THUMB" : preset === 1080 ? "IG" : preset === 512 ? "ICON" : preset === 1500 ? "HD" : "4K"} {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Preview Section */}
                <section className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="bg-amber-50 p-2 rounded-lg">
                      <ImageIcon className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-[0.15em]">Live Preview</h3>
                  </div>
                  
                  <div className="flex-1 bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-100 border-dashed relative overflow-hidden">
                    {cropData ? (
                      <div className="flex flex-col items-center w-full animate-in">
                        <div className="relative mb-8 max-w-full">
                          <img 
                            src={cropData} 
                            alt="cropped" 
                            className="w-40 h-40 md:w-48 md:h-48 shadow-xl rounded-2xl border-4 border-white object-cover ring-1 ring-slate-100" 
                          />
                          <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded-lg border-2 border-white uppercase">
                            {resolution}²
                          </div>
                        </div>
                        <button
                          onClick={handleDownload}
                          disabled={!resolution || resolution < 100}
                          className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" strokeWidth={3} /> DOWNLOAD
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ring-1 ring-slate-100">
                          <ImageIconLucide className="w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                          Click Apply Crop<br/>to render
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
        
        <footer className="mt-8 px-2 flex flex-col md:flex-row items-center justify-between gap-4 opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">© 2026 ONEBYONE • NO CLOUD PROCESSING</p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Built with precision</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
