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
    id: 'template-1',
    title: 'Executive Summary Template',
    content: 'This executive summary provides a comprehensive overview of our proposed solution, highlighting key deliverables, timeline, and expected outcomes. Our approach focuses on delivering measurable business value while ensuring seamless integration with existing systems.',
    formattedContent: [
      { text: 'This executive summary provides a comprehensive overview of our proposed solution, highlighting ',         style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'key deliverables', style: { bold: true, fontSize: 'lg', fontFamily: 'Arial' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'timeline', style: { bold: true, fontSize: 'lg', fontFamily: 'Arial' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'expected outcomes', style: { bold: true, fontSize: 'lg', fontFamily: 'Arial' } },
      { text: '. Our approach focuses on delivering ', style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'measurable business value', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Arial' } },
      { text: ' while ensuring seamless integration with existing systems.', style: { fontSize: 'base', fontFamily: 'Arial' } }
    ],
    category: 'Executive',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Arial',
      fontSize: '2xl',
      bold: true,
      italic: false,
      underline: false
    },
    contentFormatting: {
      fontFamily: 'Arial',
      fontSize: 'base',
      bold: false,
      italic: false,
      underline: false
    }
  },
  
  {
    id: 'template-2',
    title: 'Technical Specification Template',
    content: 'The technical specification outlines the detailed requirements, architecture, and implementation approach for the proposed solution. This includes system requirements, data flow diagrams, security protocols, and performance benchmarks that ensure optimal system performance.',
    formattedContent: [
      { text: 'The technical specification outlines the detailed requirements, architecture, and implementation approach for the proposed solution. This includes ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'system requirements', style: { bold: true, fontSize: 'lg', fontFamily: 'Roboto' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'data flow diagrams', style: { bold: true, fontSize: 'lg', fontFamily: 'Roboto' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'security protocols', style: { bold: true, fontSize: 'lg', fontFamily: 'Roboto' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'performance benchmarks', style: { bold: true, fontSize: 'lg', fontFamily: 'Roboto' } },
      { text: ' that ensure ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'optimal system performance', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Roboto' } },
      { text: '.', style: { fontSize: 'base', fontFamily: 'Roboto' } }
    ],
    category: 'Technical',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Roboto',
      fontSize: 'xl',
      bold: true,
      italic: true,
      underline: false
    },
    contentFormatting: {
      fontFamily: 'Roboto',
      fontSize: 'sm',
      bold: false,
      italic: false,
      underline: false
    }
  },
  
  {
    id: 'template-3',
    title: 'Project Timeline Template',
    content: 'Our project timeline is structured in phases to ensure systematic delivery and quality control. Phase 1 focuses on discovery and planning, Phase 2 on development and testing, and Phase 3 on deployment and knowledge transfer. Each phase includes milestone reviews and stakeholder sign-offs.',
    formattedContent: [
      { text: 'Our project timeline is structured in phases to ensure systematic delivery and quality control. ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'Phase 1', style: { bold: true, fontSize: 'lg', fontFamily: 'Open Sans' } },
      { text: ' focuses on discovery and planning, ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'Phase 2', style: { bold: true, fontSize: 'lg', fontFamily: 'Open Sans' } },
      { text: ' on development and testing, and ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'Phase 3', style: { bold: true, fontSize: 'lg', fontFamily: 'Open Sans' } },
      { text: ' on deployment and knowledge transfer. Each phase includes ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'milestone reviews', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: ' and ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'stakeholder sign-offs', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: '.', style: { fontSize: 'base', fontFamily: 'Open Sans' } }
    ],
    category: 'Timeline',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Open Sans',
      fontSize: 'lg',
      bold: true,
      italic: false,
      underline: true
    },
    contentFormatting: {
      fontFamily: 'Open Sans',
      fontSize: 'base',
      bold: false,
      italic: false,
      underline: false
    }
  },
  
  {
    id: 'template-4',
    title: 'Cost Analysis Template',
    content: 'The comprehensive cost analysis includes all direct and indirect costs associated with the project implementation. This covers labor costs, software licensing, hardware requirements, training expenses, and ongoing maintenance. We provide detailed breakdowns with transparent pricing and flexible payment terms.',
    formattedContent: [
      { text: 'The comprehensive cost analysis includes all direct and indirect costs associated with the project implementation. This covers ', style: { fontSize: 'base', fontFamily: 'Lato' } },
      { text: 'labor costs', style: { bold: true, fontSize: 'lg', fontFamily: 'Lato' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Lato' } },
      { text: 'software licensing', style: { bold: true, fontSize: 'lg', fontFamily: 'Lato' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Lato' } },
      { text: 'hardware requirements', style: { bold: true, fontSize: 'lg', fontFamily: 'Lato' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Lato' } },
      { text: 'training expenses', style: { bold: true, fontSize: 'lg', fontFamily: 'Lato' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Lato' } },
      { text: 'ongoing maintenance', style: { bold: true, fontSize: 'lg', fontFamily: 'Lato' } },
      { text: '. We provide ', style: { fontSize: 'base', fontFamily: 'Lato' } },
      { text: 'detailed breakdowns', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Lato' } },
      { text: ' with transparent pricing and flexible payment terms.', style: { fontSize: 'base', fontFamily: 'Lato' } }
    ],
    category: 'Financial',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Lato',
      fontSize: 'xl',
      bold: true,
      italic: true,
      underline: true,
      // color: '#7c3aed'
    },
    contentFormatting: {
      fontFamily: 'Lato',
      fontSize: 'lg',
      bold: false,
      italic: false,
      underline: false,
      // color: '#374151'
    }
  },
  
  {
    id: 'template-5',
    title: 'Quality Assurance Template',
    content: 'Our quality assurance framework ensures that all deliverables meet the highest standards of excellence. This includes comprehensive testing protocols, code reviews, security audits, and performance validation. We maintain strict quality gates throughout the development lifecycle to guarantee successful project delivery.',
    formattedContent: [
      { text: 'Our quality assurance framework ensures that all deliverables meet the highest standards of excellence. This includes ', style: { fontSize: 'base', fontFamily: 'Poppins' } },
      { text: 'comprehensive testing protocols', style: { bold: true, fontSize: 'lg', fontFamily: 'Poppins' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Poppins' } },
      { text: 'code reviews', style: { bold: true, fontSize: 'lg', fontFamily: 'Poppins' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Poppins' } },
      { text: 'security audits', style: { bold: true, fontSize: 'lg', fontFamily: 'Poppins' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Poppins' } },
      { text: 'performance validation', style: { bold: true, fontSize: 'lg', fontFamily: 'Poppins' } },
      { text: '. We maintain ', style: { fontSize: 'base', fontFamily: 'Poppins' } },
      { text: 'strict quality gates', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Poppins' } },
      { text: ' throughout the development lifecycle to guarantee ', style: { fontSize: 'base', fontFamily: 'Poppins' } },
      { text: 'successful project delivery', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Poppins' } },
      { text: '.', style: { fontSize: 'base', fontFamily: 'Poppins' } }
    ],
    category: 'Quality',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Poppins',
      fontSize: '2xl',
      bold: true,
      italic: false,
      underline: false
    },
    contentFormatting: {
      fontFamily: 'Poppins',
      fontSize: 'sm',
      bold: false,
      italic: false,
      underline: false
    }
  },
  
  {
    id: 'template-6',
    title: 'Risk Assessment Template',
    content: 'This comprehensive risk assessment identifies potential project risks and mitigation strategies. We evaluate technical risks, resource constraints, timeline dependencies, and external factors that may impact project success. Each risk is categorized by probability and impact, with detailed contingency plans developed for high-priority items.',
    formattedContent: [
      { text: 'This comprehensive risk assessment identifies potential project risks and mitigation strategies. We evaluate ', style: { fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: 'technical risks', style: { bold: true, fontSize: 'lg', fontFamily: 'Montserrat' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: 'resource constraints', style: { bold: true, fontSize: 'lg', fontFamily: 'Montserrat' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: 'timeline dependencies', style: { bold: true, fontSize: 'lg', fontFamily: 'Montserrat' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: 'external factors', style: { bold: true, fontSize: 'lg', fontFamily: 'Montserrat' } },
      { text: ' that may impact project success. Each risk is categorized by ', style: { fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: 'probability and impact', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: ', with detailed ', style: { fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: 'contingency plans', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: ' developed for high-priority items.', style: { fontSize: 'base', fontFamily: 'Montserrat' } }
    ],
    category: 'Risk',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Montserrat',
      fontSize: 'xl',
      bold: true,
      italic: false,
      underline: true
    },
    contentFormatting: {
      fontFamily: 'Montserrat',
      fontSize: 'base',
      bold: false,
      italic: false,
      underline: false
    }
  },
  
  {
    id: 'template-7',
    title: 'Communication Plan Template',
    content: 'Our communication strategy ensures effective stakeholder engagement throughout the project lifecycle. This includes regular status updates, milestone reporting, issue escalation procedures, and change management communications. We establish clear communication channels, frequency schedules, and escalation matrices to maintain transparency and alignment.',
    formattedContent: [
      { text: 'Our communication strategy ensures effective stakeholder engagement throughout the project lifecycle. This includes ', style: { fontSize: 'base', fontFamily: 'Nunito' } },
      { text: 'regular status updates', style: { bold: true, fontSize: 'lg', fontFamily: 'Nunito' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Nunito' } },
      { text: 'milestone reporting', style: { bold: true, fontSize: 'lg', fontFamily: 'Nunito' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Nunito' } },
      { text: 'issue escalation procedures', style: { bold: true, fontSize: 'lg', fontFamily: 'Nunito' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Nunito' } },
      { text: 'change management communications', style: { bold: true, fontSize: 'lg', fontFamily: 'Nunito' } },
      { text: '. We establish ', style: { fontSize: 'base', fontFamily: 'Nunito' } },
      { text: 'clear communication channels', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Nunito' } },
      { text: ', frequency schedules, and escalation matrices to maintain ', style: { fontSize: 'base', fontFamily: 'Nunito' } },
      { text: 'transparency and alignment', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Nunito' } },
      { text: '.', style: { fontSize: 'base', fontFamily: 'Nunito' } }
    ],
    category: 'Communication',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Nunito',
      fontSize: '2xl',
      bold: true,
      italic: true,
      underline: false,
      // color: '#2563eb'
    },
    contentFormatting: {
      fontFamily: 'Nunito',
      fontSize: 'lg',
      bold: false,
      italic: false,
      underline: false,
      // color: '#374151'
    }
  },
  
  {
    id: 'template-8',
    title: 'Training and Support Template',
    content: 'Comprehensive training and support services ensure successful system adoption and user proficiency. Our training program includes user documentation, hands-on workshops, video tutorials, and ongoing support through helpdesk services. We provide role-based training modules, certification programs, and continuous learning resources to maximize user productivity.',
    formattedContent: [
      { text: 'Comprehensive training and support services ensure successful system adoption and user proficiency. Our training program includes ', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } },
      { text: 'user documentation', style: { bold: true, fontSize: 'lg',  fontFamily: 'Source Sans Pro' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } },
      { text: 'hands-on workshops', style: { bold: true, fontSize: 'lg',  fontFamily: 'Source Sans Pro' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } },
      { text: 'video tutorials', style: { bold: true, fontSize: 'lg',  fontFamily: 'Source Sans Pro' } },
      { text: ', and ongoing support through ', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } },
      { text: 'helpdesk services', style: { bold: true, fontSize: 'lg',  fontFamily: 'Source Sans Pro' } },
      { text: '. We provide ', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } },
      { text: 'role-based training modules', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Source Sans Pro' } },
      { text: ', certification programs, and continuous learning resources to maximize ', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } },
      { text: 'user productivity', style: { italic: true, underline: true, fontSize: 'base',  fontFamily: 'Source Sans Pro' } },
      { text: '.', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } }
    ],
    category: 'Training',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Source Sans Pro',
      fontSize: 'lg',
      bold: true,
      italic: false,
      underline: true,
      
    },
    contentFormatting: {
      fontFamily: 'Source Sans Pro',
      fontSize: 'sm',
      bold: false,
      italic: false,
      underline: false,
     
    }
  },
  
  {
    id: 'template-9',
    title: 'Compliance and Security Template',
    content: 'Our compliance and security framework ensures adherence to industry standards and regulatory requirements. This includes data protection measures, access controls, audit trails, and regular security assessments. We implement industry best practices for cybersecurity, privacy protection, and regulatory compliance to safeguard sensitive information and maintain trust.',
    formattedContent: [
      { text: 'Our compliance and security framework ensures adherence to industry standards and regulatory requirements. This includes ', style: { fontSize: 'base', fontFamily: 'Ubuntu' } },
      { text: 'data protection measures', style: { bold: true, fontSize: 'lg',  fontFamily: 'Ubuntu' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Ubuntu' } },
      { text: 'access controls', style: { bold: true, fontSize: 'lg',  fontFamily: 'Ubuntu' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Ubuntu' } },
      { text: 'audit trails', style: { bold: true, fontSize: 'lg',  fontFamily: 'Ubuntu' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Ubuntu' } },
      { text: 'regular security assessments', style: { bold: true, fontSize: 'lg', fontFamily: 'Ubuntu' } },
      { text: '. We implement ', style: { fontSize: 'base', fontFamily: 'Ubuntu' } },
      { text: 'industry best practices', style: { italic: true, underline: true, fontSize: 'base',  fontFamily: 'Ubuntu' } },
      { text: ' for cybersecurity, privacy protection, and regulatory compliance to safeguard ', style: { fontSize: 'base', fontFamily: 'Ubuntu' } },
      { text: 'sensitive information', style: { italic: true, underline: true, fontSize: 'base',  fontFamily: 'Ubuntu' } },
      { text: ' and maintain trust.', style: { fontSize: 'base', fontFamily: 'Ubuntu' } }
    ],
    category: 'Compliance',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Ubuntu',
      fontSize: 'xl',
      bold: true,
      italic: true,
      underline: true,
     
    },
    contentFormatting: {
      fontFamily: 'Ubuntu',
      fontSize: 'base',
      bold: false,
      italic: false,
      underline: false,
    
    }
  },
  
  {
    id: 'template-10',
    title: 'Performance Metrics Template',
    content: 'Key performance indicators and success metrics provide measurable outcomes for project evaluation and continuous improvement. We establish baseline measurements, target thresholds, and monitoring mechanisms to track progress and identify optimization opportunities. Regular performance reviews and data analysis ensure alignment with business objectives and drive strategic decision-making.',
    formattedContent: [
      { text: 'Key performance indicators and success metrics provide measurable outcomes for project evaluation and continuous improvement. We establish ', style: { fontSize: 'base', fontFamily: 'Work Sans' } },
      { text: 'baseline measurements', style: { bold: true, fontSize: 'lg', fontFamily: 'Work Sans' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Work Sans' } },
      { text: 'target thresholds', style: { bold: true, fontSize: 'lg',  fontFamily: 'Work Sans' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Work Sans' } },
      { text: 'monitoring mechanisms', style: { bold: true, fontSize: 'lg',  fontFamily: 'Work Sans' } },
      { text: ' to track progress and identify ', style: { fontSize: 'base', fontFamily: 'Work Sans' } },
      { text: 'optimization opportunities', style: { bold: true, fontSize: 'lg',  fontFamily: 'Work Sans' } },
      { text: '. Regular ', style: { fontSize: 'base', fontFamily: 'Work Sans' } },
      { text: 'performance reviews', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Work Sans' } },
      { text: ' and data analysis ensure alignment with ', style: { fontSize: 'base', fontFamily: 'Work Sans' } },
      { text: 'business objectives', style: { italic: true, underline: true, fontSize: 'base',  fontFamily: 'Work Sans' } },
      { text: ' and drive strategic decision-making.', style: { fontSize: 'base', fontFamily: 'Work Sans' } }
    ],
    category: 'Metrics',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Work Sans',
      fontSize: '2xl',
      bold: true,
      italic: false,
      underline: false,
      // color: '#f59e0b'
    },
    contentFormatting: {
      fontFamily: 'Work Sans',
      fontSize: 'lg',
      bold: false,
      italic: false,
      underline: false,
      // color: '#5b5b5b'
    }
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
      fontFamily: 'Arial',
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
      fontFamily: 'Arial',
      headerHeight: '100px',
      footerHeight: '60px'
    }
  }
];