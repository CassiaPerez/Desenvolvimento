import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../types';

interface ProjectCardProps {
  project: Project;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onEdit: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onUpdate, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [draftStatus, setDraftStatus] = useState(project.status);
  const [draftProgress, setDraftProgress] = useState(project.progress);
  
  // Sync state when props change
  useEffect(() => {
    setDraftStatus(project.status);
    setDraftProgress(project.progress);
  }, [project.status, project.progress]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(project.id, {
        status: draftStatus,
        progress: draftProgress
    });
  };

  const handleFullEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(project);
  };

  const isPurple = project.status === ProjectStatus.IN_PROGRESS;
  const colorClass = isPurple ? 'brand-lavender' : 'brand-blue';
  const borderColorClass = isPurple ? 'border-brand-lavender/20' : 'border-brand-blue/20';
  const pulseClass = isPurple ? 'pulse-lavender' : 'pulse-indicator';
  const shadowClass = isPurple ? 'shadow-[0_0_8px_rgba(208,92,227,0.7)]' : 'shadow-[0_0_8px_#00CFFF]';
  const bgClass = isPurple ? 'bg-brand-lavender' : 'bg-brand-blue';
  const textClass = isPurple ? 'text-brand-lavender' : 'text-brand-blue';
  
  // Dynamic class for the range input accent color
  const accentClass = isPurple ? 'accent-brand-lavender' : 'accent-brand-blue';

  return (
    <div 
        className={`cyber-table-row border ${borderColorClass} p-5 rounded-lg relative group mb-3 transition-all duration-300 ${isExpanded ? 'bg-black/60 ring-1 ring-' + colorClass + '/30' : 'hover:bg-[#15171C]'}`}
    >
      {/* --- MINIMAL HEADER (Always Visible) --- */}
      <div 
        className="cursor-pointer flex items-center justify-between gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
          {/* Left: Vitality Dot + Name + Metadata (Status/Sector) */}
          <div className="flex items-start gap-4 overflow-hidden">
            <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${bgClass} ${pulseClass}`}></span>
            
            <div className="flex flex-col gap-1">
                <h3 className={`font-display font-bold text-white text-lg md:text-xl uppercase tracking-wide truncate group-hover:${textClass} transition-colors`}>
                  {project.name}
                </h3>
                
                {/* Status and Sector Line */}
                <div className="flex items-center flex-wrap gap-2 text-[10px] font-mono font-bold uppercase tracking-wider">
                    <span className={`${textClass}`}>
                        {project.status}
                    </span>
                    <span className="text-gray-700">|</span>
                    <span className="text-gray-500 flex items-center gap-1">
                         <span className="material-symbols-outlined text-[10px]">domain</span>
                         {project.sector}
                    </span>
                </div>
            </div>
          </div>

          {/* Right: Chevron Only */}
          <div className="flex items-center gap-4 flex-shrink-0">
             <div className={`w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-gray-800 rotate-180 text-white' : 'text-gray-600 group-hover:text-brand-blue group-hover:border-brand-blue/30'}`}>
                <span className="material-symbols-outlined">expand_more</span>
             </div>
          </div>
      </div>

      {/* --- EXPANDED DETAILS CONTENT --- */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-800 animate-[fadeIn_0.3s_ease-out]">
            
            {/* Top Details Grid: Meta & Description */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                
                {/* Meta Information Column */}
                <div className="md:col-span-4 space-y-4 border-r border-gray-800/50 pr-4">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">ID do Sistema</p>
                        <span className="font-mono text-sm text-gray-300 bg-gray-900/50 px-2 py-0.5 rounded">{project.code}</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Stack Tecnológico</p>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, idx) => (
                                <span key={idx} className={`text-[10px] font-mono uppercase px-2 py-1 rounded border border-${colorClass}/20 text-${colorClass} bg-${colorClass}/5`}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Description & Progress Column */}
                <div className="md:col-span-8 flex flex-col justify-between">
                     <div className="mb-6">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">description</span>
                            Descritivo do Projeto
                        </p>
                        <p className="text-gray-300 font-sans text-sm leading-relaxed border-l-2 border-gray-800 pl-4 py-1">
                            {project.description || "Nenhuma descrição disponível para este sistema."}
                        </p>
                     </div>

                     <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Progresso de Desenvolvimento</span>
                            <span className="font-mono text-sm text-white font-bold">{project.progress}%</span>
                        </div>
                        <div className={`w-full bg-gray-950 h-2 rounded-full relative overflow-hidden border border-${colorClass}/10`}>
                            <div 
                                className={`absolute top-0 left-0 ${bgClass} h-full ${shadowClass}`} 
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                     </div>
                </div>
            </div>

            {/* --- Control Panel (Edit Mode) --- */}
            <div className="mb-6 p-4 bg-[#121418] border border-gray-800 rounded-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue/50"></div>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-display font-bold text-gray-400 text-xs uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-brand-blue">tune</span>
                        Painel de Controle
                    </h4>
                    <button
                        onClick={handleFullEdit}
                        className="text-[10px] font-display font-bold text-brand-blue uppercase tracking-widest border-b border-brand-blue/30 hover:text-white hover:border-white transition-colors flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-sm">edit_square</span>
                        Editar Dados Mestres
                    </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Ajustar Status</label>
                        <select 
                            value={draftStatus}
                            onChange={(e) => setDraftStatus(e.target.value as ProjectStatus)}
                            className="w-full bg-black/40 border border-gray-700 text-gray-200 text-sm rounded p-2 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none font-mono uppercase cursor-pointer hover:border-gray-500 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {Object.values(ProjectStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex-1 w-full">
                         <div className="flex justify-between mb-2">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ajustar Progresso</label>
                            <span className="text-xs font-mono font-bold text-brand-blue">{draftProgress}%</span>
                         </div>
                         <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={draftProgress}
                            onChange={(e) => setDraftProgress(Number(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer ${accentClass}`}
                         />
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        className="w-full md:w-auto px-6 py-2 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/50 text-brand-blue font-display font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_10px_rgba(0,207,255,0.1)] hover:shadow-[0_0_15px_rgba(0,207,255,0.2)] flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">save</span>
                        Salvar
                    </button>
                </div>
            </div>
            
            {/* --- Team & Footer --- */}
            <div className="flex flex-col md:flex-row gap-6 border-t border-gray-800 pt-6">
                 {/* Team Mini View */}
                 <div className="flex-1">
                    <h4 className="font-display font-bold text-gray-500 text-[10px] mb-3 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">groups</span>
                        Equipe Vinculada
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {project.team.length > 0 ? (
                             project.team.map(member => (
                                <div key={member.id} title={member.name} className="relative group/avatar">
                                    <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded border border-gray-700 object-cover" />
                                </div>
                             ))
                        ) : (
                            <span className="text-gray-600 font-mono text-xs italic">Nenhum membro alocado.</span>
                        )}
                    </div>
                 </div>

                 {/* Footer Links */}
                 <div className="flex items-end justify-between md:justify-end gap-6 flex-1">
                    <div className="text-right">
                         <p className="text-[10px] text-gray-500 uppercase font-mono mb-1">Última atualização</p>
                         <p className="text-white font-mono text-xs flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {project.updatedAt}
                         </p>
                    </div>
                    
                    {project.url && (
                        <a 
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 hover:bg-brand-blue/20 px-4 py-2 rounded-sm text-xs font-display font-bold text-brand-blue transition-colors shadow-[0_0_10px_rgba(0,207,255,0.1)] hover:shadow-[0_0_15px_rgba(0,207,255,0.2)]"
                        >
                            ACESSAR SISTEMA
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                        </a>
                    )}
                 </div>
            </div>

        </div>
      )}
    </div>
  );
};