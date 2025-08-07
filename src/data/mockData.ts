import { DocumentType, TextBlock, DocumentTemplate } from '../types';

export const documentTypes: DocumentType[] = [
  {
    id: 'rfp',
    name: 'RFP Response',
    description: 'Comprehensive response to Request for Proposal documents',
    icon: 'FileText'
  },
  {
    id: 'sow',
    name: 'Statement of Work',
    description: 'Detailed project scope and deliverables document',
    icon: 'Briefcase'
  },
  {
    id: 'proposal',
    name: 'Business Proposal',
    description: 'Professional business proposal for new opportunities',
    icon: 'PresentationChart'
  },
  {
    id: 'contract',
    name: 'Service Contract',
    description: 'Service agreement and contract terms',
    icon: 'FileSignature'
  }
];

export const textBlocks: TextBlock[] = [
  {
    id: 'intro-1',
    title: 'Company Introduction - Technology Focus',
    content: 'Our company has been at the forefront of technology innovation for over two decades, specializing in enterprise solutions that drive digital transformation. We combine deep technical expertise with industry best practices to deliver measurable business outcomes.',
    formattedContent: [
      { text: 'Our company has been at the ', style: { fontSize: 'base' } },
      { text: 'forefront of technology innovation', style: { bold: true, fontSize: 'lg', color: '#2563eb' } },
      { text: ' for over ', style: { fontSize: 'base' } },
      { text: 'two decades', style: { bold: true, italic: true, fontSize: 'base' } },
      { text: ', specializing in enterprise solutions that drive ', style: { fontSize: 'base' } },
      { text: 'digital transformation', style: { bold: true, fontSize: 'lg', color: '#059669' } },
      { text: '. We combine deep technical expertise with industry best practices to deliver ', style: { fontSize: 'base' } },
      { text: 'measurable business outcomes', style: { bold: true, underline: true, fontSize: 'base' } },
      { text: '.', style: { fontSize: 'base' } }
    ],
    category: 'Introduction',
    isSelected: false
  },
  {
    id: 'intro-2',
    title: 'Company Introduction - Service Excellence',
    content: 'We pride ourselves on delivering exceptional service quality and maintaining long-term partnerships with our clients. Our team of certified professionals brings extensive experience across various industries and technology platforms.',
    formattedContent: [
      { text: 'We pride ourselves on delivering ', style: { fontSize: 'base' } },
      { text: 'exceptional service quality', style: { bold: true, fontSize: 'lg', color: '#7c3aed' } },
      { text: ' and maintaining ', style: { fontSize: 'base' } },
      { text: 'long-term partnerships', style: { italic: true, fontSize: 'base', color: '#dc2626' } },
      { text: ' with our clients. Our team of ', style: { fontSize: 'base' } },
      { text: 'certified professionals', style: { bold: true, underline: true, fontSize: 'base' } },
      { text: ' brings extensive experience across various industries and technology platforms.', style: { fontSize: 'base' } }
    ],
    category: 'Introduction',
    isSelected: false
  },
  {
    id: 'req-1',
    title: 'Standard Requirements - Technical',
    content: 'All technical implementations will follow industry best practices and comply with relevant security standards including SOC 2, ISO 27001, and applicable regulatory requirements. Solutions will be designed for scalability, maintainability, and optimal performance.',
    formattedContent: [
      { text: 'All technical implementations will follow ', style: { fontSize: 'base' } },
      { text: 'industry best practices', style: { bold: true, fontSize: 'lg', color: '#059669' } },
      { text: ' and comply with relevant security standards including ', style: { fontSize: 'base' } },
      { text: 'SOC 2', style: { bold: true, fontSize: 'base', color: '#dc2626' } },
      { text: ', ', style: { fontSize: 'base' } },
      { text: 'ISO 27001', style: { bold: true, fontSize: 'base', color: '#dc2626' } },
      { text: ', and applicable regulatory requirements. Solutions will be designed for ', style: { fontSize: 'base' } },
      { text: 'scalability', style: { italic: true, fontSize: 'base' } },
      { text: ', ', style: { fontSize: 'base' } },
      { text: 'maintainability', style: { italic: true, fontSize: 'base' } },
      { text: ', and ', style: { fontSize: 'base' } },
      { text: 'optimal performance', style: { italic: true, fontSize: 'base' } },
      { text: '.', style: { fontSize: 'base' } }
    ],
    category: 'Requirements',
    isSelected: false
  },
  {
    id: 'req-2',
    title: 'Standard Requirements - Project Management',
    content: 'Project delivery will follow established project management methodologies with regular status reporting, milestone tracking, and stakeholder communication. All deliverables will be reviewed and approved before proceeding to subsequent phases.',
    formattedContent: [
      { text: 'Project delivery will follow ', style: { fontSize: 'base' } },
      { text: 'established project management methodologies', style: { bold: true, fontSize: 'lg', color: '#2563eb' } },
      { text: ' with regular ', style: { fontSize: 'base' } },
      { text: 'status reporting', style: { underline: true, fontSize: 'base' } },
      { text: ', ', style: { fontSize: 'base' } },
      { text: 'milestone tracking', style: { underline: true, fontSize: 'base' } },
      { text: ', and ', style: { fontSize: 'base' } },
      { text: 'stakeholder communication', style: { underline: true, fontSize: 'base' } },
      { text: '. All deliverables will be ', style: { fontSize: 'base' } },
      { text: 'reviewed and approved', style: { bold: true, italic: true, fontSize: 'base', color: '#059669' } },
      { text: ' before proceeding to subsequent phases.', style: { fontSize: 'base' } }
    ],
    category: 'Requirements',
    isSelected: false
  },
  {
    id: 'assume-1',
    title: 'Standard Assumptions - Infrastructure',
    content: 'We assume that existing infrastructure meets minimum requirements for the proposed solution. Any infrastructure upgrades or modifications required will be identified during the discovery phase and may result in additional costs.',
    formattedContent: [
      { text: 'We assume that ', style: { fontSize: 'base' } },
      { text: 'existing infrastructure', style: { bold: true, fontSize: 'lg', color: '#7c3aed' } },
      { text: ' meets minimum requirements for the proposed solution. Any ', style: { fontSize: 'base' } },
      { text: 'infrastructure upgrades', style: { italic: true, fontSize: 'base' } },
      { text: ' or ', style: { fontSize: 'base' } },
      { text: 'modifications', style: { italic: true, fontSize: 'base' } },
      { text: ' required will be identified during the ', style: { fontSize: 'base' } },
      { text: 'discovery phase', style: { bold: true, underline: true, fontSize: 'base', color: '#dc2626' } },
      { text: ' and may result in additional costs.', style: { fontSize: 'base' } }
    ],
    category: 'Assumptions',
    isSelected: false
  },
  {
    id: 'assume-2',
    title: 'Standard Assumptions - Access',
    content: 'Client will provide necessary access to systems, personnel, and documentation required for project completion. Any delays in providing access may impact project timeline and deliverables.',
    formattedContent: [
      { text: 'Client will provide necessary access to ', style: { fontSize: 'base' } },
      { text: 'systems', style: { bold: true, fontSize: 'base', color: '#2563eb' } },
      { text: ', ', style: { fontSize: 'base' } },
      { text: 'personnel', style: { bold: true, fontSize: 'base', color: '#2563eb' } },
      { text: ', and ', style: { fontSize: 'base' } },
      { text: 'documentation', style: { bold: true, fontSize: 'base', color: '#2563eb' } },
      { text: ' required for project completion. Any ', style: { fontSize: 'base' } },
      { text: 'delays in providing access', style: { italic: true, fontSize: 'base', color: '#dc2626' } },
      { text: ' may impact ', style: { fontSize: 'base' } },
      { text: 'project timeline', style: { underline: true, fontSize: 'base' } },
      { text: ' and ', style: { fontSize: 'base' } },
      { text: 'deliverables', style: { underline: true, fontSize: 'base' } },
      { text: '.', style: { fontSize: 'base' } }
    ],
    category: 'Assumptions',
    isSelected: false
  },
  {
    id: 'except-1',
    title: 'Standard Exceptions - Third Party',
    content: 'This proposal does not include third-party licensing costs, hardware procurement, or integration with systems not explicitly mentioned in the requirements. Any additional integrations will be quoted separately.',
    formattedContent: [
      { text: 'This proposal does not include ', style: { fontSize: 'base' } },
      { text: 'third-party licensing costs', style: { bold: true, fontSize: 'lg', color: '#dc2626' } },
      { text: ', ', style: { fontSize: 'base' } },
      { text: 'hardware procurement', style: { bold: true, fontSize: 'lg', color: '#dc2626' } },
      { text: ', or ', style: { fontSize: 'base' } },
      { text: 'integration with systems', style: { bold: true, fontSize: 'lg', color: '#dc2626' } },
      { text: ' not explicitly mentioned in the requirements. Any ', style: { fontSize: 'base' } },
      { text: 'additional integrations', style: { italic: true, underline: true, fontSize: 'base' } },
      { text: ' will be quoted separately.', style: { fontSize: 'base' } }
    ],
    category: 'Exceptions',
    isSelected: false
  },
  {
    id: 'except-2',
    title: 'Standard Exceptions - Training',
    content: 'End-user training beyond standard documentation and knowledge transfer sessions is not included in this proposal. Additional training programs can be provided at standard rates upon request.',
    formattedContent: [
      { text: 'End-user training beyond ', style: { fontSize: 'base' } },
      { text: 'standard documentation', style: { bold: true, fontSize: 'base', color: '#7c3aed' } },
      { text: ' and ', style: { fontSize: 'base' } },
      { text: 'knowledge transfer sessions', style: { bold: true, fontSize: 'base', color: '#7c3aed' } },
      { text: ' is not included in this proposal. ', style: { fontSize: 'base' } },
      { text: 'Additional training programs', style: { italic: true, fontSize: 'base' } },
      { text: ' can be provided at ', style: { fontSize: 'base' } },
      { text: 'standard rates', style: { underline: true, fontSize: 'base', color: '#059669' } },
      { text: ' upon request.', style: { fontSize: 'base' } }
    ],
    category: 'Exceptions',
    isSelected: false
  },
  {
    id: 'resource-1',
    title: 'Standard Resources - Project Team',
    content: 'Our dedicated project team will include a Project Manager, Technical Lead, Senior Developers, and Quality Assurance specialists. All team members are certified professionals with relevant industry experience.',
    formattedContent: [
      { text: 'Our dedicated project team will include a ', style: { fontSize: 'base' } },
      { text: 'Project Manager', style: { bold: true, fontSize: 'lg', color: '#2563eb' } },
      { text: ', ', style: { fontSize: 'base' } },
      { text: 'Technical Lead', style: { bold: true, fontSize: 'lg', color: '#2563eb' } },
      { text: ', ', style: { fontSize: 'base' } },
      { text: 'Senior Developers', style: { bold: true, fontSize: 'lg', color: '#2563eb' } },
      { text: ', and ', style: { fontSize: 'base' } },
      { text: 'Quality Assurance specialists', style: { bold: true, fontSize: 'lg', color: '#2563eb' } },
      { text: '. All team members are ', style: { fontSize: 'base' } },
      { text: 'certified professionals', style: { italic: true, underline: true, fontSize: 'base', color: '#059669' } },
      { text: ' with relevant industry experience.', style: { fontSize: 'base' } }
    ],
    category: 'Resources',
    isSelected: false
  },
  {
    id: 'resource-2',
    title: 'Standard Resources - Support',
    content: 'Post-implementation support includes 30 days of warranty support, documentation, and knowledge transfer. Extended support and maintenance agreements are available under separate terms.',
    formattedContent: [
      { text: 'Post-implementation support includes ', style: { fontSize: 'base' } },
      { text: '30 days of warranty support', style: { bold: true, fontSize: 'lg', color: '#059669' } },
      { text: ', ', style: { fontSize: 'base' } },
      { text: 'documentation', style: { italic: true, fontSize: 'base' } },
      { text: ', and ', style: { fontSize: 'base' } },
      { text: 'knowledge transfer', style: { italic: true, fontSize: 'base' } },
      { text: '. ', style: { fontSize: 'base' } },
      { text: 'Extended support and maintenance agreements', style: { bold: true, underline: true, fontSize: 'base', color: '#7c3aed' } },
      { text: ' are available under separate terms.', style: { fontSize: 'base' } }
    ],
    category: 'Resources',
    isSelected: false
  }
];

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'professional',
    name: 'Professional Standard',
    description: 'Clean, professional template suitable for most business documents',
    headerContent: '{{customerName}} - {{projectName}}',
    footerContent: 'Confidential and Proprietary',
    styles: {
      primaryColor: '#2563eb',
      fontFamily: 'Inter',
      headerHeight: '80px',
      footerHeight: '40px'
    }
  },
  {
    id: 'executive',
    name: 'Executive Summary',
    description: 'Formal template for executive-level presentations',
    headerContent: '{{customerName}} | {{projectName}} | Executive Summary',
    footerContent: 'Page {{pageNumber}} of {{totalPages}} | Confidential',
    styles: {
      primaryColor: '#1e40af',
      fontFamily: 'Inter',
      headerHeight: '100px',
      footerHeight: '60px'
    }
  }
];