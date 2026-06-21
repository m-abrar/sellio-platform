import React, { useState } from 'react';
import { 
  HiOutlineCloudArrowUp, 
  HiOutlineXMark, 
  HiOutlinePhoto, 
  HiOutlineTrash,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi2';

export default function MediaStudio({ files, setFiles }: any) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | number | null>(null);

  // Styling Constants
  const controlBtnClass = "p-2 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-[#6610f2] hover:scale-110 transition-all duration-300";

  const moveImage = (e: React.MouseEvent, index: number, direction: 'left' | 'right') => {
    e.preventDefault(); e.stopPropagation();
    const newFiles = [...files];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: `new-${crypto.randomUUID()}`,
        file,
        preview: URL.createObjectURL(file as any),
        isMain: files.length === 0, 
        existing: false
      }));
      setFiles((prev: any) => [...prev, ...newFiles]);
    }
  };

  const setMain = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault(); e.stopPropagation();
    setFiles((prev: any[]) => prev.map((f: any) => ({
      ...f,
      isMain: String(f.id) === String(id) 
    })));
  };

  const removeFile = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault(); e.stopPropagation();
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setFiles((prevFiles: any[]) => {
      const fileToDelete = prevFiles.find(f => String(f.id) === String(id));
      const updatedList = prevFiles.filter(f => String(f.id) !== String(id));
      if (fileToDelete?.preview && !fileToDelete.existing) URL.revokeObjectURL(fileToDelete.preview);
      if (fileToDelete?.isMain && updatedList.length > 0) {
        return updatedList.map((file, index) => ({ ...file, isMain: index === 0 }));
      }
      return updatedList;
    });
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="w-8 h-8 bg-[#6610f2]/10 rounded-xl flex items-center justify-center">
            <HiOutlinePhoto className="w-4 h-4 text-[#6610f2]" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Listing Photos</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{files.length} Files Attached</span>
      </div>

      {/* ELITE DROPZONE */}
      <div className="group relative border-4 border-dashed border-slate-50 rounded-[2.5rem] p-12 transition-all hover:border-[#6610f2]/20 hover:bg-[#6610f2]/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden">
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        
        <div className="w-20 h-20 bg-white rounded-[1.8rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <HiOutlineCloudArrowUp className="w-10 h-10 text-[#6610f2]" />
        </div>
        
        <div className="text-center">
            <p className="text-lg font-black text-slate-900 italic tracking-tight">Upload Images.</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Drag & Drop or Click to Browse</p>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#6610f2]/5 rounded-bl-full -mr-12 -mt-12 group-hover:bg-[#6610f2]/10 transition-colors" />
      </div>

      {/* PREVIEW GRID */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {files.map((item: any, index: number) => {
            const isConfirming = String(confirmDeleteId) === String(item.id);
            
            return (
              <div 
                key={item.id} 
                onMouseLeave={() => setConfirmDeleteId(null)}
                className={`relative aspect-[4/5] rounded-[2rem] overflow-hidden group border-2 transition-all duration-500 ${
                  item.isMain ? 'border-[#6610f2] shadow-2xl scale-[1.03] z-20' : 'border-transparent shadow-sm'
                }`}
              >
                <img src={item.preview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                
                {/* Overlay Controls */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${
                  isConfirming ? 'bg-red-600/90 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-slate-900/60'
                }`}>
                  
                  {isConfirming ? (
                    <button type="button" onClick={(e) => removeFile(e, item.id)} className="flex flex-col items-center text-white space-y-2 animate-bounce">
                      <HiOutlineTrash className="w-8 h-8" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Confirm Delete</span>
                    </button>
                  ) : (
                    <div className="space-y-4 w-full px-4">
                      {/* Reorder Row */}
                      <div className="flex justify-center gap-2">
                        <button onClick={(e) => moveImage(e, index, 'left')} className={controlBtnClass}><HiChevronLeft className="w-5 h-5" /></button>
                        <button onClick={(e) => moveImage(e, index, 'right')} className={controlBtnClass}><HiChevronRight className="w-5 h-5" /></button>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center justify-center gap-2 pt-2">
                         {!item.isMain && (
                          <button onClick={(e) => setMain(e, item.id)} className="px-5 py-3 bg-[#6610f2] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-[#6610f2] transition-all">
                            Master
                          </button>
                        )}
                        <button onClick={(e) => removeFile(e, item.id)} className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                          <HiOutlineXMark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Labels */}
                {item.isMain && (
                   <div className="absolute top-4 left-4 bg-[#6610f2] text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg italic">
                    Primary
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 text-[9px] font-black w-7 h-7 flex items-center justify-center rounded-xl shadow-md border border-slate-100">
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
