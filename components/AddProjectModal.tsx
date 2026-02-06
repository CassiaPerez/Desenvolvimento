import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  projectToEdit?: Project | null;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSubmit, projectToEdit }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('');
  const [techInput, setTechInput] = useState('');
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.PENDING);

  // Load project data when editing
  useEffect(() => {
    if (isOpen && projectToEdit) {
      setName(projectToEdit.name);
      setCode(projectToEdit.code);
      setUrl(projectToEdit.url || '');
      setDescription(projectToEdit.description || '');
      setSector(projectToEdit.sector);
      setTechInput(projectToEdit.technologies.join(', '));
      setStatus(projectToEdit.status);
    } else if (isOpen && !projectToEdit) {
      // Reset form for new project
      setName('');
      setCode('');
      setUrl('');
      setDescription('');
      setSector('');
      setTechInput('');
      setStatus(ProjectStatus.PENDING);
    }
  }, [isOpen, projectToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process technologies from comma-separated string
    const technologies = techInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

    const projectData = {
      name,
      code,
      url,
      description,
      sector: sector || 'Geral',
      technologies,
      status, // Include status in submission
      // If editing, preserve progress. If new, default to 0.
      ...(projectToEdit ? {} : {
        progress: 0,
        team: []
      })
    };

    onSubmit(projectData);
    onClose();
  };

  const isEditing = !!projectToEdit;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#121418] border border-brand-blue shadow-[0_0_30px_rgba(0,207,255,0.2)] rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Decorative Header Line */}
        <div className="h-1 w-full bg-brand-blue shadow-[0_0_10px_#00CFFF]"></div>
        
        <div className="p-6">
          <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-blue">
              {isEditing ? 'edit_square' : 'add_circle'}
            </span>
            {isEditing ? 'EDITAR PROJETO' : 'NOVO PROJETO'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-display font-bold text-brand-blue uppercase tracking-widest mb-1">
                Nome do Projeto
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none font-mono transition-colors"
                placeholder="EX: MÓDULO DE SEGURANÇA"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-display font-bold text-brand-blue uppercase tracking-widest mb-1">
                    ID do Sistema
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none font-mono transition-colors"
                    placeholder="EX: SYS_9921"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-display font-bold text-brand-blue uppercase tracking-widest mb-1">
                    Setor / Depto
                  </label>
                  <input
                    type="text"
                    required
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none font-mono transition-colors"
                    placeholder="EX: FINANCEIRO"
                  />
                </div>
            </div>

            {/* Status Selection */}
            <div>
                <label className="block text-[10px] font-display font-bold text-brand-blue uppercase tracking-widest mb-1">
                    Status Atual
                </label>
                <div className="relative">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                        className="w-full bg-black/40 border border-gray-700 rounded p-2 text-xs text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none font-mono uppercase appearance-none cursor-pointer"
                    >
                        {Object.values(ProjectStatus).map((s) => (
                            <option key={s} value={s} className="bg-gray-900">{s}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-blue">
                         <span className="material-symbols-outlined text-sm">expand_more</span>
                    </div>
                </div>
            </div>

            <div>
               <label className="block text-[10px] font-display font-bold text-brand-blue uppercase tracking-widest mb-1">
                Função do Sistema (Descrição)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none font-sans transition-colors resize-none h-20"
                placeholder="Descreva o objetivo e função principal..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold text-brand-blue uppercase tracking-widest mb-1">
                Tecnologias (Separadas por vírgula)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none font-mono transition-colors"
                placeholder="React, Python, Oracle..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold text-brand-blue uppercase tracking-widest mb-1">
                URL do Projeto (Opcional)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none font-mono transition-colors"
                placeholder="https://..."
              />
            </div>

            <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-400 font-display font-bold text-xs rounded hover:bg-gray-800 transition-colors uppercase"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-blue text-cyber-black font-display font-black text-xs rounded shadow-[0_0_15px_rgba(0,207,255,0.4)] hover:shadow-[0_0_25px_rgba(0,207,255,0.6)] transition-all uppercase"
                >
                  {isEditing ? 'Atualizar Sistema' : 'Inicializar'}
                </button>
            </div>
          </form>
        </div>
        
        {/* Decorative corner */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-blue/50"></div>
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-blue/50"></div>
      </div>
    </div>
  );
};