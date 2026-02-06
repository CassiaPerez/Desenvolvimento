import React from 'react';
import { Project, ProjectStatus } from '../types';

interface ProjectListItemProps {
  project: Project;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({ project }) => {
  return (
    <div className="cyber-table-row flex items-center gap-5 p-4 border border-brand-blue/10 rounded-lg">
      <div className="w-12 h-12 rounded-md bg-brand-blue/10 flex items-center justify-center border border-brand-blue/30 shadow-[inset_0_0_8px_rgba(0,207,255,0.1)]">
        <span className="material-symbols-outlined text-brand-blue text-2xl">analytics</span>
      </div>
      <div className="flex-1">
        <h4 className="text-base font-display font-bold text-gray-300 uppercase tracking-wide">{project.name}</h4>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className={`text-[10px] font-bold font-mono uppercase ${project.status === ProjectStatus.PENDING ? 'text-brand-blue' : 'text-gray-400'}`}>
                {project.status === ProjectStatus.PENDING ? 'Pendente' : project.status}
            </p>
            <span className="text-[10px] text-gray-600">|</span>
            <p className="text-[10px] font-mono text-brand-blue/70 uppercase font-bold">{project.sector}</p>
        </div>
      </div>
    </div>
  );
};