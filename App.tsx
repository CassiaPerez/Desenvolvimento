import React, { useState, useEffect, useMemo } from 'react';
import { BackgroundRain } from './components/BackgroundRain';
import { Header } from './components/Header';
import { ProjectCard } from './components/ProjectCard';
import { ProjectListItem } from './components/ProjectListItem';
import { AddProjectModal } from './components/AddProjectModal';
import { Project, ProjectStatus } from './types';
import { supabase } from './lib/supabaseClient';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');

  // --- Data Fetching ---
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Map Database fields (snake_case) to Frontend types (camelCase)
        const mappedProjects: Project[] = data.map((item: any) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          sector: item.sector,
          technologies: item.technologies || [],
          status: item.status as ProjectStatus,
          progress: item.progress,
          updatedAt: new Date(item.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          team: item.team || [],
          url: item.url
        }));
        setProjects(mappedProjects);
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      // Fallback/Error handling UI could go here
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- CRUD Operations ---

  const handleModalSubmit = async (projectData: Partial<Project>) => {
    try {
      if (editingProject) {
        // Update existing project in Supabase
        const { error } = await supabase
          .from('projects')
          .update({
            code: projectData.code,
            name: projectData.name,
            description: projectData.description,
            sector: projectData.sector,
            technologies: projectData.technologies,
            url: projectData.url,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProject.id);

        if (error) throw error;
      } else {
        // Insert new project - ID generation handled by Database
        const { error } = await supabase
          .from('projects')
          .insert([{
            code: projectData.code || 'UNK_0000',
            name: projectData.name || 'Novo Projeto',
            status: ProjectStatus.PENDING,
            progress: 0,
            updated_at: new Date().toISOString(),
            team: [],
            description: projectData.description || '',
            sector: projectData.sector || 'Geral',
            technologies: projectData.technologies || [],
            url: projectData.url
          }]);

        if (error) throw error;
      }

      // Refresh data after operation
      await fetchProjects();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      alert('Falha na conexão com o banco de dados.');
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
        // Optimistic Update for UI responsiveness
        setProjects(prevProjects => 
            prevProjects.map(project => 
            project.id === id 
                ? { ...project, ...updates, updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) } 
                : project
            )
        );

        // Map updates to DB format
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.progress !== undefined) dbUpdates.progress = updates.progress;

        const { error } = await supabase
            .from('projects')
            .update(dbUpdates)
            .eq('id', id);

        if (error) {
            // Revert on error (optional implementation)
            console.error('Erro ao atualizar status:', error);
            fetchProjects(); // Re-sync with server
        }
    } catch (err) {
        console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const filteredProjects = useMemo(() => {
    let result = projects;

    // 1. Filter by Status
    if (statusFilter !== 'ALL') {
      result = result.filter(project => project.status === statusFilter);
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(project => {
        // Check Name
        if (project.name.toLowerCase().includes(lowerQuery)) return true;
        // Check Code/ID
        if (project.code.toLowerCase().includes(lowerQuery)) return true;
        // Check Description
        if (project.description?.toLowerCase().includes(lowerQuery)) return true;
        // Check Sector
        if (project.sector?.toLowerCase().includes(lowerQuery)) return true;
        // Check Technologies
        if (project.technologies.some(tech => tech.toLowerCase().includes(lowerQuery))) return true;
        
        return false;
      });
    }

    // 3. Custom Sorting: Priority (Online -> In Progress -> Delayed -> Pending)
    // We use [...result] to create a copy and avoid mutating state directly with .sort()
    return [...result].sort((a, b) => {
      const getPriority = (status: ProjectStatus) => {
        switch (status) {
          case ProjectStatus.ONLINE: return 1;
          case ProjectStatus.IN_PROGRESS: return 2;
          case ProjectStatus.DELAYED: return 3;
          case ProjectStatus.PENDING: return 4;
          default: return 99;
        }
      };

      const priorityA = getPriority(a.status);
      const priorityB = getPriority(b.status);

      return priorityA - priorityB;
    });

  }, [projects, searchQuery, statusFilter]);

  const highPriorityProjects = filteredProjects.filter(p => p.status !== ProjectStatus.PENDING);
  const pendingProjects = filteredProjects.filter(p => p.status === ProjectStatus.PENDING);
  
  const isFiltering = searchQuery.trim() !== '' || statusFilter !== 'ALL';

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden text-gray-300 font-sans selection:bg-brand-blue selection:text-black">
      <BackgroundRain />
      
      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        
        <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
          {/* Executive Dashboard Header */}
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="font-display text-4xl font-black text-white uppercase italic tracking-tight shadow-brand-blue drop-shadow-[0_0_5px_rgba(0,207,255,0.5)]">
                Comando Executivo
              </h1>
              <div className="flex items-center gap-3 text-xs font-display text-brand-blue mt-2">
                <span className="bg-brand-blue/10 px-3 py-1 rounded border border-brand-blue/40 tracking-widest uppercase">
                  Sessão Criptografada
                </span>
                <span className="text-gray-500 font-bold text-sm">
                   {isLoading ? 'SYNC_DB...' : 'DB_CONNECTED'}
                </span>
              </div>
            </div>
            
            <div className="hidden md:block text-right">
               <div className="text-gray-500 text-xs font-mono mb-1">DATA DO SISTEMA</div>
               <div className="text-xl font-display font-bold text-white">{new Date().toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          {/* Search Bar - Robust Implementation */}
          <div className="relative mb-8 group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500 text-xl group-focus-within:text-brand-blue transition-colors">search</span>
             </div>
             <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121418] border border-brand-blue/30 text-white text-lg rounded-sm py-4 pl-12 pr-4 placeholder-gray-600 focus:outline-none focus:border-brand-blue focus:shadow-[0_0_15px_rgba(0,207,255,0.3)] transition-all font-mono"
                placeholder="BUSCAR SISTEMA / SETOR / DESCRIÇÃO..."
              />
             <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-xs font-display text-brand-blue/50 tracking-widest uppercase">
                   {filteredProjects.length} RESULTADOS
                </span>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={openAddModal}
              className="w-full md:w-auto md:min-w-[200px] bg-brand-blue text-cyber-black font-display font-black py-4 px-6 rounded-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,207,255,0.4)] hover:shadow-[0_0_30px_rgba(0,207,255,0.6)] hover:bg-[#33d9ff] active:scale-95 transition-all uppercase text-base border-b-4 border-brand-blue/50"
            >
              <span className="material-symbols-outlined text-xl">add_box</span>
              Iniciar Projeto
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-cyber-black scrollbar-thumb-cyber-gray">
            <button
                onClick={() => setStatusFilter('ALL')}
                className={`whitespace-nowrap px-6 py-3 rounded-sm text-xs font-display font-bold uppercase tracking-wider border transition-all flex-shrink-0
                ${statusFilter === 'ALL' 
                    ? 'bg-brand-blue/20 border-brand-blue text-brand-blue shadow-[0_0_10px_rgba(0,207,255,0.2)]' 
                    : 'bg-cyber-charcoal border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-400'
                }`}
            >
                Todos
            </button>
            {Object.values(ProjectStatus).map((status) => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`whitespace-nowrap px-6 py-3 rounded-sm text-xs font-display font-bold uppercase tracking-wider border transition-all flex-shrink-0
                    ${statusFilter === status 
                        ? 'bg-brand-blue/20 border-brand-blue text-brand-blue shadow-[0_0_10px_rgba(0,207,255,0.2)]' 
                        : 'bg-cyber-charcoal border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-400'
                    }`}
                >
                    {status}
                </button>
            ))}
          </div>

          {/* Project Lists */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6 px-1 border-b border-gray-800 pb-2">
              <h2 className="font-display font-bold text-white text-lg tracking-widest uppercase flex items-center gap-3">
                <span className="w-3 h-6 bg-brand-blue shadow-[0_0_8px_#00CFFF] inline-block"></span>
                {isFiltering ? 'Resultados Filtrados' : 'Tarefas de Alta Prioridade'}
              </h2>
              {isFiltering && (
                <button 
                  onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                  className="text-brand-blue text-xs font-display font-bold uppercase border-b border-brand-blue/30 tracking-tighter hover:text-white transition-colors"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
            
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-mono text-brand-blue animate-pulse">ESTABELECENDO UPLINK COM DATABASE...</p>
                     </div>
                </div>
            ) : (
                <div className="space-y-4">
                  {highPriorityProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        onUpdate={handleUpdateProject}
                        onEdit={openEditModal}
                      />
                  ))}
                  
                  {filteredProjects.length === 0 && (
                     <div className="p-12 text-center border border-dashed border-gray-800 rounded">
                        <p className="text-gray-400 font-mono text-sm">NENHUM PROJETO ENCONTRADO COM OS FILTROS ATUAIS.</p>
                     </div>
                  )}
                  
                  {pendingProjects.map((project) => (
                    <ProjectListItem key={project.id} project={project} />
                  ))}
                </div>
            )}
          </div>
        </main>
      </div>

      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSubmit={handleModalSubmit}
        projectToEdit={editingProject}
      />
    </div>
  );
}

export default App;