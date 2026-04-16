import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineMapPin, 
  HiOutlinePlus 
} from 'react-icons/hi2';
import { toast } from 'sonner';
import { getProperties, deleteProperty } from '../../api/properties';
import { triggerDeletion } from '../../utils/animations';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await getProperties();
      // Handling Laravel's data wrapping
      setProperties(response.data.data || response.data);
    } catch (err: any) {
      console.error("Sync Error:", err);
      toast.error("Failed to synchronize property portfolio.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    toast(`Decommission "${title}"?`, {
      description: "Asset will be removed from global listings.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await deleteProperty(id);
            triggerDeletion();
            setProperties(prev => prev.filter(p => p.id !== id));
            toast.success("Asset decommissioned successfully.");
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Protocol failed: Asset locked.");
          }
        },
      },
    });
  };

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. HEADER */}
      <PageHeader 
        badge="Asset Management" 
        title="Real Estate" 
        subtitle="Portfolio"
      >
        <button 
          onClick={() => navigate('/dashboard/properties/create')}
          className="bg-slate-900 text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#6610f2] transition-all flex items-center justify-center group"
        >
          <HiOutlinePlus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
          Add Property
        </button>
      </PageHeader>

      {/* 2. BODY */}
      {isLoading ? (
        <div className="space-y-8">
           <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-100 h-96 animate-pulse p-12">
             <div className="space-y-6">
                <div className="h-8 bg-slate-50 rounded-xl w-1/3" />
                <div className="h-12 bg-slate-50 rounded-xl w-full" />
                <div className="h-12 bg-slate-50 rounded-xl w-full" />
             </div>
           </div>
           <div className="lg:hidden space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="h-44 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
              ))}
           </div>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left bg-slate-50/40">
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Property Identity</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Valuation</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-20 text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Zero assets identified</p>
                    </td>
                  </tr>
                ) : (
                  properties.map((prop) => (
                    <tr key={prop.id} className="group hover:bg-slate-50/30 transition-all duration-300">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-16 rounded-[1.2rem] overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0">
                            <img 
                              src={prop.thumbnail_image} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                              alt={prop.title} 
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-lg font-black tracking-tighter mb-1 truncate text-slate-900">{prop.title}</p>
                            <div className="flex items-center gap-2 text-slate-400">
                              <HiOutlineMapPin className="w-3 h-3 text-[#6610f2]" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">
                                {prop.location.city}, {prop.location.country}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">
                          {prop.pricing.price_formatted}
                        </span>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {prop.status.is_rental ? 'Per Night' : 'Total Value'}
                        </p>
                      </td>
                      <td className="px-10 py-6 text-right relative overflow-hidden">
                        <div className="relative h-16 flex items-center justify-end">
                          {/* Visible by default */}
                          <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-black uppercase tracking-widest ${prop.status.color_class.replace('bg-', 'text-')}`}>
                                {prop.status.label}
                              </span>
                              <span className={`w-2 h-2 rounded-full ${prop.status.color_class} ${prop.status.is_published ? 'animate-pulse' : ''}`} />
                            </div>
                          </div>
                          {/* Visible on hover */}
                          <div className="absolute inset-y-0 right-0 flex items-center gap-3 opacity-0 translate-y-[-20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                            <button onClick={() => navigate(`/dashboard/properties/edit/${prop.slug}`)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:text-[#6610f2] hover:shadow-xl transition-all">
                              <HiOutlinePencilSquare className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(prop.id, prop.title)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:text-red-500 hover:shadow-xl transition-all">
                              <HiOutlineTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="lg:hidden space-y-6">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group">
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-50 shrink-0 border-4 border-white shadow-md">
                    <img src={prop.featured_image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <span className="text-[9px] font-black text-[#6610f2] bg-[#6610f2]/5 px-3 py-1 rounded-full uppercase tracking-widest">
                      {prop.specs.property_type}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 truncate mt-2 italic tracking-tight">{prop.title}</h3>
                    <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">{prop.pricing.price_formatted_k}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${prop.status.color_class}`} />
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{prop.status.label}</span>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => navigate(`/dashboard/properties/edit/${prop.slug}`)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl"><HiOutlinePencilSquare className="w-5 h-5" /></button>
                       <button onClick={() => handleDelete(prop.id, prop.title)} className="p-4 bg-red-50/50 text-red-400 rounded-2xl"><HiOutlineTrash className="w-5 h-5" /></button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}