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
    category: 'Introduction',
    isSelected: false
  },
  {
    id: 'intro-2',
    title: 'Company Introduction - Service Excellence',
    content: 'We pride ourselves on delivering exceptional service quality and maintaining long-term partnerships with our clients. Our team of certified professionals brings extensive experience across various industries and technology platforms.',
    category: 'Introduction',
    isSelected: false
  },
  {
    id: 'req-1',
    title: 'Standard Requirements - Technical',
    content: 'All technical implementations will follow industry best practices and comply with relevant security standards including SOC 2, ISO 27001, and applicable regulatory requirements. Solutions will be designed for scalability, maintainability, and optimal performance.',
    category: 'Requirements',
    isSelected: false
  },
  {
    id: 'req-2',
    title: 'Standard Requirements - Project Management',
    content: 'Project delivery will follow established project management methodologies with regular status reporting, milestone tracking, and stakeholder communication. All deliverables will be reviewed and approved before proceeding to subsequent phases.',
    category: 'Requirements',
    isSelected: false
  },
  {
    id: 'assume-1',
    title: 'Standard Assumptions - Infrastructure',
    content: 'We assume that existing infrastructure meets minimum requirements for the proposed solution. Any infrastructure upgrades or modifications required will be identified during the discovery phase and may result in additional costs.',
    category: 'Assumptions',
    isSelected: false
  },
  {
    id: 'assume-2',
    title: 'Standard Assumptions - Access',
    content: 'Client will provide necessary access to systems, personnel, and documentation required for project completion. Any delays in providing access may impact project timeline and deliverables.',
    category: 'Assumptions',
    isSelected: false
  },
  {
    id: 'except-1',
    title: 'Standard Exceptions - Third Party',
    content: 'This proposal does not include third-party licensing costs, hardware procurement, or integration with systems not explicitly mentioned in the requirements. Any additional integrations will be quoted separately.',
    category: 'Exceptions',
    isSelected: false
  },
  {
    id: 'except-2',
    title: 'Standard Exceptions - Training',
    content: 'End-user training beyond standard documentation and knowledge transfer sessions is not included in this proposal. Additional training programs can be provided at standard rates upon request.',
    category: 'Exceptions',
    isSelected: false
  },
  {
    id: 'resource-1',
    title: 'Standard Resources - Project Team',
    content: 'Our dedicated project team will include a Project Manager, Technical Lead, Senior Developers, and Quality Assurance specialists. All team members are certified professionals with relevant industry experience.',
    category: 'Resources',
    isSelected: false
  },
  {
    id: 'resource-2',
    title: 'Standard Resources - Support',
    content: 'Post-implementation support includes 30 days of warranty support, documentation, and knowledge transfer. Extended support and maintenance agreements are available under separate terms.',
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