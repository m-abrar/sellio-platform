import { HiOutlineUser, HiOutlineShieldCheck, HiOutlineEnvelope, HiOutlineMapPin } from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';

export default function ProfilePage() {
  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]";

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in zoom-in-95 duration-700">
      <PageHeader 
        badge="Account Identity" 
        title="Partner" 
        subtitle="Profile"
      >
        <button className="bg-slate-900 text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#6610f2] transition-all">
          Update Profile
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* AVATAR & STATS */}
        <div className={`lg:col-span-4 p-10 flex flex-col items-center text-center ${containerClass}`}>
          <div className="w-40 h-40 rounded-[3rem] p-2 border-4 border-[#6610f2]/10 relative mb-6">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400" 
              className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl"
              alt="Profile" 
            />
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">Abrar Ahmed</h2>
          <p className="text-[10px] font-black text-[#6610f2] uppercase tracking-[0.3em] mt-2">Executive Partner</p>
          
          <div className="w-full grid grid-cols-2 gap-4 mt-10">
            <div className="p-6 bg-slate-50 rounded-[1.8rem]">
              <p className="text-[18px] font-black text-slate-900 italic">124</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Deals</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-[1.8rem]">
              <p className="text-[18px] font-black text-slate-900 italic">4.9</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
            </div>
          </div>
        </div>

        {/* DETAILS FORM */}
        <div className={`lg:col-span-8 p-10 md:p-14 ${containerClass}`}>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10">Security Details.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: 'Full Name', value: 'Abrar Ahmed', icon: HiOutlineUser },
              { label: 'Email Address', value: 'abrar@partner.com', icon: HiOutlineEnvelope },
              { label: 'Regional Office', value: 'Dubai, UAE', icon: HiOutlineMapPin },
              { label: 'Verification', value: 'Level 4 Certified', icon: HiOutlineShieldCheck },
            ].map((item, idx) => (
              <div key={idx} className="group cursor-default">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{item.label}</label>
                <div className="flex items-center gap-4 p-5 bg-slate-50 border border-transparent group-hover:border-slate-200 group-hover:bg-white rounded-2xl transition-all">
                  <item.icon className="w-5 h-5 text-[#6610f2]" />
                  <span className="font-bold text-slate-700">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}