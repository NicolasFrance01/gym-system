import { X, Info } from 'lucide-react';

export default function SystemNoticeModal({ announcement, isOpen, onClose }: { announcement: any, isOpen?: boolean, onClose?: () => void }) {
  if (!isOpen || !announcement || !announcement.active) return null;

  const handleDismiss = () => {
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1b2435] border border-gray-200 dark:border-white/10 rounded-[35px] p-6 md:p-8 shadow-2xl overflow-hidden text-black dark:text-white animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Glow background */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button 
          onClick={handleDismiss} 
          className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 overflow-y-auto custom-scrollbar pr-2 pt-2">
          <div className="flex items-center gap-4 mb-2">
            {/* Gym Icon */}
            <div className="w-14 h-14 bg-[#141b29] dark:bg-black/40 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
              <img src="/favicon.png" alt="Gym" className="w-10 h-10 object-contain dark:invert" />
            </div>
            
            <div className="text-gray-300 animate-pulse">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>

            {/* Atlascore Icon */}
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-gray-100">
              <img src="/logoAtlascore.png" alt="Atlascore" className="w-10 h-10 object-contain" />
            </div>
          </div>

          <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
            {announcement.title}
          </h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase">
            <Info size={12} />
            {announcement.subtitle}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center space-y-3 mt-4 px-2">
            {(announcement.date_start || announcement.date_end || announcement.version_from || announcement.version_to) && (
              <p>
                Informamos que durante los días 
                {announcement.date_start && <span> <strong>{announcement.date_start}</strong></span>}
                {announcement.date_end && <span> y <strong>{announcement.date_end}</strong></span>}
                {(announcement.version_from || announcement.version_to) && <span> se estará realizando la actualización del sistema</span>}
                {announcement.version_from && <span>, migrando de <strong>{announcement.version_from}</strong></span>}
                {announcement.version_to && <span> a la nueva versión <strong>{announcement.version_to}</strong></span>}.
              </p>
            )}
            
            {announcement.date_productive && (
              <p>
                La nueva versión quedará productiva y disponible a partir del <strong>{announcement.date_productive}</strong>.
              </p>
            )}

            {announcement.description && (
              <p className="text-xs opacity-80 mt-2">
                {announcement.description}
              </p>
            )}

            <p className="font-bold pt-2 mt-4">
              Atentamente,<br/>Equipo Atlascore
            </p>
          </div>
        </div>
        
        {/* Fixed footer button */}
        <div className="pt-6 mt-auto">
          <button 
            onClick={handleDismiss}
            className="w-full py-3.5 bg-[#0a0a0a] dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-gray-200 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
