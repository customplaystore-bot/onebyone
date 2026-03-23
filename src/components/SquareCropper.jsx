import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { 
  Crop, 
  RotateCcw, 
  RotateCw,
  ZoomIn, 
  ZoomOut, 
  Move, 
  RefreshCw,
  AlignJustify,
  ChevronRight,
  FlipHorizontal,
  FlipVertical
} from "lucide-react";

const SquareCropper = forwardRef(({ image, onCropComplete, onReset }, ref) => {
  const cropperRef = useRef(null);
  const [dragMode, setDragMode] = useState("crop");

  useImperativeHandle(ref, () => ({
    getCroppedCanvas: (options) => {
      return cropperRef.current?.cropper.getCroppedCanvas(options);
    },
    reset: () => {
      cropperRef.current?.cropper.reset();
    }
  }));

  const handleZoomIn = () => cropperRef.current?.cropper.zoom(0.1);
  const handleZoomOut = () => cropperRef.current?.cropper.zoom(-0.1);
  
  const handleSetDragMode = (mode) => {
    setDragMode(mode);
    cropperRef.current?.cropper.setDragMode(mode);
  };

  const handleResetCanvas = () => cropperRef.current?.cropper.reset();

  const handleRotateLeft = () => cropperRef.current?.cropper.rotate(-90);
  const handleRotateRight = () => cropperRef.current?.cropper.rotate(90);

  const handleFlipHorizontal = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const { scaleX } = cropper.getData();
    cropper.scaleX(scaleX === -1 ? 1 : -1);
  };

  const handleFlipVertical = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const { scaleY } = cropper.getData();
    cropper.scaleY(scaleY === -1 ? 1 : -1);
  };

  const handleFitWidth = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const imageData = cropper.getImageData();
    const cropBoxData = cropper.getCropBoxData();
    const ratio = cropBoxData.width / imageData.naturalWidth;
    cropper.zoomTo(ratio);
    const newImageData = cropper.getImageData();
    cropper.moveTo(cropBoxData.left, cropBoxData.top + (cropBoxData.height - newImageData.height) / 2);
  };

  const handleFitHeight = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const imageData = cropper.getImageData();
    const cropBoxData = cropper.getCropBoxData();
    const ratio = cropBoxData.height / imageData.naturalHeight;
    cropper.zoomTo(ratio);
    const newImageData = cropper.getImageData();
    cropper.moveTo(cropBoxData.left + (cropBoxData.width - newImageData.width) / 2, cropBoxData.top);
  };

  const handleGenerateCrop = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 800,
        height: 800
      });
      onCropComplete(croppedCanvas.toDataURL());
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-1 bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
        <div className="flex-1 relative bg-slate-50 min-h-[400px]">
          <Cropper
            ref={cropperRef}
            style={{ height: "100%", width: "100%" }}
            zoomTo={0.5}
            initialAspectRatio={1}
            aspectRatio={1}
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            guides={true}
            zoomable={true}
            scalable={true}
            className="cropper-modern"
          />
        </div>
        
        {/* Modern Toolbar */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-50 flex flex-wrap items-center justify-between gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center bg-slate-50 p-1.5 rounded-[20px] border border-slate-100 min-w-max">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSetDragMode("crop")}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  dragMode === "crop" 
                  ? "bg-white text-indigo-600 shadow-[0_8px_20px_rgba(79,70,229,0.15)] ring-1 ring-slate-100" 
                  : "text-slate-400 hover:text-slate-600"
                }`}
                title="Crop Mode"
              >
                <Crop className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => handleSetDragMode("move")}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  dragMode === "move" 
                  ? "bg-white text-indigo-600 shadow-[0_8px_20px_rgba(79,70,229,0.15)] ring-1 ring-slate-100" 
                  : "text-slate-400 hover:text-slate-600"
                }`}
                title="Pan Mode"
              >
                <Move className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="w-px h-8 bg-slate-200 mx-2 opacity-50"></div>
            
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all duration-300"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all duration-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="w-px h-8 bg-slate-200 mx-2 opacity-50"></div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleRotateLeft}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all duration-300"
                title="Rotate Left"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={handleRotateRight}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all duration-300"
                title="Rotate Right"
              >
                <RotateCw className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="w-px h-8 bg-slate-200 mx-2 opacity-50"></div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleFlipHorizontal}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all duration-300"
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={handleFlipVertical}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all duration-300"
                title="Flip Vertical"
              >
                <FlipVertical className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="w-px h-8 bg-slate-200 mx-2 opacity-50"></div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleFitWidth}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all duration-300 flex items-center gap-2"
                title="Fit to Width"
              >
                <AlignJustify className="w-5 h-5 rotate-90" strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-tighter hidden xl:inline">Fit Width</span>
              </button>
              <button
                type="button"
                onClick={handleFitHeight}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all duration-300 flex items-center gap-2"
                title="Fit to Height"
              >
                <AlignJustify className="w-5 h-5" strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-tighter hidden xl:inline">Fit Height</span>
              </button>
            </div>

            <div className="w-px h-8 bg-slate-200 mx-2 opacity-50"></div>

            <button
              type="button"
              onClick={handleResetCanvas}
              className="p-3 text-slate-400 hover:text-rose-500 hover:bg-white rounded-2xl transition-all duration-300"
              title="Reset View"
            >
              <RefreshCw className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex gap-4 items-center ml-auto">
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors px-4"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateCrop}
              className="group bg-slate-900 text-white pl-8 pr-6 py-4 rounded-2xl font-black text-xs flex items-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              APPLY CROP
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SquareCropper;
