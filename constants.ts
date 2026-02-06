import { Project, ProjectStatus } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'intra_corp',
    code: 'INTRA_V2',
    name: 'Intranet',
    url: 'https://intranet.grupocropfield.com.br',
    description: 'Portal corporativo para comunicação interna, RH, reservas e centralização de serviços.',
    sector: 'Comunicação / RH',
    technologies: ['SharePoint', 'React', 'Office 365'],
    status: ProjectStatus.ONLINE,
    progress: 100,
    updatedAt: '08:00',
    team: []
  },
  {
    id: 'crop_flow',
    code: 'BPM_FLOW',
    name: 'CropFlow',
    url: 'https://cropflow.grupocropfield.com.br',
    description: 'Plataforma integrada para gestão comercial, faturamento, crédito e processos internos.',
    sector: 'Comercial / Processos',
    technologies: ['Node.js', 'BPMN', 'PostgreSQL'],
    status: ProjectStatus.ONLINE,
    progress: 100,
    updatedAt: '09:15',
    team: []
  },
  {
    id: 'api_probus',
    code: 'API_ERP',
    name: 'API – Probus',
    url: '', // Sem URL pública
    description: 'API de integração entre sistemas internos e o ERP Probus (Oracle), com dados padronizados e seguros.',
    sector: 'TI / Integração',
    technologies: ['Oracle PL/SQL', 'Java', 'Rest API'],
    status: ProjectStatus.ONLINE,
    progress: 100,
    updatedAt: '10:00',
    team: []
  },
  {
    id: 'fretes_gcf',
    code: 'LOG_FROTAS',
    name: 'Fretes GCF',
    url: 'https://frotas.grupocropfield.com.br',
    description: 'Gestão de frotas, fretes e controle operacional de cargas e transportes.',
    sector: 'Logística',
    technologies: ['Google Maps API', 'React', 'Node.js'],
    status: ProjectStatus.ONLINE,
    progress: 100,
    updatedAt: '11:30',
    team: []
  },
  {
    id: 'track_lab',
    code: 'LAB_TRK',
    name: 'TrackLab',
    url: 'https://tracklab.grupocropfield.com.br',
    description: 'Sistema de rastreabilidade e gestão de amostras laboratoriais e laudos.',
    sector: 'Laboratório / Qualidade',
    technologies: ['IoT', 'Python', 'InfluxDB'],
    status: ProjectStatus.ONLINE,
    progress: 95,
    updatedAt: '14:20',
    team: []
  },
  {
    id: 'crop_service',
    code: 'ITSM_DESK',
    name: 'CropService',
    url: 'https://cropservice.grupocropfield.com.br',
    description: 'Gestão de serviços internos, chamados, manutenções e demandas operacionais.',
    sector: 'Service Desk',
    technologies: ['ServiceNow', 'Angular'],
    status: ProjectStatus.ONLINE,
    progress: 100,
    updatedAt: '07:45',
    team: []
  },
  {
    id: 'crop_log',
    code: 'WMS_LOG',
    name: 'CropLog',
    url: 'https://croplog.grupocropfield.com.br',
    description: 'Painel logístico para acompanhamento de cargas, notas fiscais e status de entrega.',
    sector: 'Logística',
    technologies: ['Oracle', 'Java', 'Android'],
    status: ProjectStatus.ONLINE,
    progress: 100,
    updatedAt: '16:00',
    team: []
  },
  {
    id: 'conv_xml',
    code: 'UTIL_XML',
    name: 'Conversor JSON → XML (Comex)',
    url: 'https://cassiaperez-converso-sget.bolt.host',
    description: 'Ferramenta para conversão padronizada de arquivos JSON para XML no contexto de comércio exterior.',
    sector: 'Comércio Exterior',
    technologies: ['Javascript', 'XML'],
    status: ProjectStatus.ONLINE,
    progress: 100,
    updatedAt: '12:10',
    team: []
  },
  {
    id: 'calc_ncm',
    code: 'TAX_NCM',
    name: 'Calculadora NCM',
    url: 'https://comex.base44.app',
    description: 'Calculadora tributária para NCM com apoio à análise de impostos e classificação fiscal.',
    sector: 'Fiscal / Comex',
    technologies: ['React', 'Tax API'],
    status: ProjectStatus.ONLINE,
    progress: 100,
    updatedAt: '13:00',
    team: []
  },
  {
    id: 'crm_cobranca',
    code: 'FIN_CRM',
    name: 'CRM Cobrança',
    url: '',
    description: 'Sistema para controle de cobranças, inadimplência, histórico de clientes e acompanhamento financeiro.',
    sector: 'Financeiro',
    technologies: ['Power BI', 'SQL Server', 'Python'],
    status: ProjectStatus.IN_PROGRESS,
    progress: 45,
    updatedAt: '15:30',
    team: []
  }
];