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
    content: 'This executive summary provides a comprehensive overview of our proposed solution, highlighting key deliverables, timeline, and expected outcomes. Our approach focuses on delivering measurable business value while ensuring seamless integration with existing systems.\n\nKey Highlights:\n• Strategic alignment with business objectives\n• Proven methodology and best practices\n• Experienced team with domain expertise\n• Risk-mitigated implementation approach\n\nProject Phases:\n1. Discovery and Requirements Analysis\n2. Solution Design and Architecture\n3. Development and Testing\n4. Deployment and Go-Live\n5. Post-Implementation Support',
    formattedContent: [
      { text: 'This executive summary provides a comprehensive overview of our proposed solution, highlighting ',         style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'key deliverables', style: { bold: true, fontSize: 'lg', fontFamily: 'Arial', color: '#dc2626' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'timeline', style: { bold: true, fontSize: 'lg', fontFamily: 'Arial', color: '#6b7280' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'expected outcomes', style: { bold: true, fontSize: 'lg', fontFamily: 'Arial', color: '#dc2626' } },
      { text: '. Our approach focuses on delivering ', style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'measurable business value', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Arial' } },
      { text: ' while ensuring seamless integration with existing systems.\n\n', style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'Key Highlights:', style: { bold: true, fontSize: 'lg', fontFamily: 'Arial', color: '#dc2626' } },
      { text: '\n• Strategic alignment with business objectives\n• Proven methodology and best practices\n• Experienced team with domain expertise\n• Risk-mitigated implementation approach\n\n', style: { fontSize: 'base', fontFamily: 'Arial' } },
      { text: 'Project Phases:', style: { bold: true, fontSize: 'lg', fontFamily: 'Arial', color: '#6b7280' } },
      { text: '\n1. Discovery and Requirements Analysis\n2. Solution Design and Architecture\n3. Development and Testing\n4. Deployment and Go-Live\n5. Post-Implementation Support', style: { fontSize: 'base', fontFamily: 'Arial' } }
    ],
    category: 'Executive',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Arial',
      fontSize: '2xl',
      bold: true,
      italic: false,
      underline: false,
      color: '#dc2626'
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
    content: 'The technical specification outlines the detailed requirements, architecture, and implementation approach for the proposed solution. This includes system requirements, data flow diagrams, security protocols, and performance benchmarks that ensure optimal system performance.\n\nSystem Requirements:\n• Minimum 8GB RAM and 4-core processor\n• Windows 10/11 or Linux Ubuntu 20.04+\n• Network connectivity with 100Mbps bandwidth\n• Database: PostgreSQL 13+ or MySQL 8.0+\n\nArchitecture Components:\n1. Frontend: React.js with TypeScript\n2. Backend: Node.js with Express framework\n3. Database: Relational database with ORM\n4. Authentication: JWT-based security\n5. API: RESTful services with OpenAPI documentation',
    formattedContent: [
      { text: 'The technical specification outlines the detailed requirements, architecture, and implementation approach for the proposed solution. This includes ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'system requirements', style: { bold: true, fontSize: 'lg', fontFamily  : 'Roboto', color: '#6b7280' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'data flow diagrams', style: { bold: true, fontSize: 'lg', fontFamily: 'Roboto', color: '#dc2626' } },
      { text: ', ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'security protocols', style: { bold: true, fontSize: 'lg', fontFamily: 'Roboto' } },
      { text: ', and ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'performance benchmarks', style: { bold: true, fontSize: 'lg', fontFamily: 'Roboto' } },
      { text: ' that ensure ', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'optimal system performance', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Roboto' } },
      { text: '.\n\n', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'System Requirements:', style: { bold: true, fontSize: 'lg', fontFamily: 'Roboto', color: '#6b7280' } },
      { text: '\n• Minimum 8GB RAM and 4-core processor\n• Windows 10/11 or Linux Ubuntu 20.04+\n• Network connectivity with 100Mbps bandwidth\n• Database: PostgreSQL 13+ or MySQL 8.0+\n\n', style: { fontSize: 'base', fontFamily: 'Roboto' } },
      { text: 'Architecture Components:', style: { bold: true, fontSize: 'lg', fontFamily: 'Roboto', color: '#dc2626' } },
      { text: '\n1. Frontend: React.js with TypeScript\n2. Backend: Node.js with Express framework\n3. Database: Relational database with ORM\n4. Authentication: JWT-based security\n5. API: RESTful services with OpenAPI documentation', style: { fontSize: 'base', fontFamily: 'Roboto' } }
    ],
    category: 'Technical',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Roboto',
      fontSize: 'xl',
      bold: true,
      italic: true,
      underline: false,
      color: '#6b7280'
    },
    contentFormatting: {
      fontFamily: 'Roboto',
      fontSize: 'sm',
      bold: false,
      italic: false,
      underline: false,
      color: '#6b7280'
    }
  },
  
  {
    id: 'template-3',
    title: 'Project Timeline Template',
    content: 'Our project timeline is structured in phases to ensure systematic delivery and quality control. Phase 1 focuses on discovery and planning, Phase 2 on development and testing, and Phase 3 on deployment and knowledge transfer. Each phase includes milestone reviews and stakeholder sign-offs.\n\nProject Milestones:\n• Week 2: Requirements gathering completed\n• Week 4: Technical design approved\n• Week 8: Development phase initiated\n• Week 12: Testing and quality assurance\n• Week 16: User acceptance testing\n• Week 18: Production deployment\n\nPhase Deliverables:\n1. Phase 1: Project charter, requirements document, technical specifications\n2. Phase 2: Core system development, unit testing, integration testing\n3. Phase 3: System deployment, user training, documentation delivery\n4. Phase 4: Go-live support, performance monitoring, optimization',
    formattedContent: [
      { text: 'Our project timeline is structured in phases to ensure systematic delivery and quality control. ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'Phase 1', style: { bold: true, fontSize: 'lg', fontFamily: 'Open Sans', color: '#dc2626' } },
      { text: ' focuses on discovery and planning, ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'Phase 2', style: { bold: true, fontSize: 'lg', fontFamily: 'Open Sans', color: '#6b7280' } },
      { text: ' on development and testing, and ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'Phase 3', style: { bold: true, fontSize: 'lg', fontFamily: 'Open Sans' } },
      { text: ' on deployment and knowledge transfer. Each phase includes ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'milestone reviews', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: ' and ', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'stakeholder sign-offs', style: { italic: true, underline: true, fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: '.\n\n', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'Project Milestones:', style: { bold: true, fontSize: 'lg', fontFamily: 'Open Sans', color: '#dc2626' } },
      { text: '\n• Week 2: Requirements gathering completed\n• Week 4: Technical design approved\n• Week 8: Development phase initiated\n• Week 12: Testing and quality assurance\n• Week 16: User acceptance testing\n• Week 18: Production deployment\n\n', style: { fontSize: 'base', fontFamily: 'Open Sans' } },
      { text: 'Phase Deliverables:', style: { bold: true, fontSize: 'lg', fontFamily: 'Open Sans', color: '#6b7280' } },
      { text: '\n1. Phase 1: Project charter, requirements document, technical specifications\n2. Phase 2: Core system development, unit testing, integration testing\n3. Phase 3: System deployment, user training, documentation delivery\n4. Phase 4: Go-live support, performance monitoring, optimization', style: { fontSize: 'base', fontFamily: 'Open Sans' } }
    ],
    category: 'Timeline',
    isSelected: false,
    titleFormatting: {
      fontFamily: 'Open Sans',
      fontSize: 'lg',
      bold: true,
      italic: false,
      underline: true,
      color: '#dc2626'
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
    content: 'The comprehensive cost analysis includes all direct and indirect costs associated with the project implementation. This covers labor costs, software licensing, hardware requirements, training expenses, and ongoing maintenance. We provide detailed breakdowns with transparent pricing and flexible payment terms.\n\nDirect Costs:\n• Development team: $150,000\n• Software licenses: $25,000\n• Hardware infrastructure: $40,000\n• Third-party integrations: $15,000\n• Testing and quality assurance: $20,000\n\nIndirect Costs:\n1. Project management overhead: $30,000\n2. Training and documentation: $18,000\n3. Contingency budget (10%): $29,800\n4. Post-implementation support: $35,000\n5. Maintenance and updates: $45,000 annually',
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
      { text: ' with transparent pricing and flexible payment terms.\n\n', style: { fontSize: 'base', fontFamily: 'Lato' } },
      { text: 'Direct Costs:', style: { bold: true, fontSize: 'lg', fontFamily: 'Lato' } },
      { text: '\n• Development team: $150,000\n• Software licenses: $25,000\n• Hardware infrastructure: $40,000\n• Third-party integrations: $15,000\n• Testing and quality assurance: $20,000\n\n', style: { fontSize: 'base', fontFamily: 'Lato' } },
      { text: 'Indirect Costs:', style: { bold: true, fontSize: 'lg', fontFamily: 'Lato' } },
      { text: '\n1. Project management overhead: $30,000\n2. Training and documentation: $18,000\n3. Contingency budget (10%): $29,800\n4. Post-implementation support: $35,000\n5. Maintenance and updates: $45,000 annually', style: { fontSize: 'base', fontFamily: 'Lato' } }
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
    content: 'Our quality assurance framework ensures that all deliverables meet the highest standards of excellence. This includes comprehensive testing protocols, code reviews, security audits, and performance validation. We maintain strict quality gates throughout the development lifecycle to guarantee successful project delivery.\n\nTesting Protocols:\n• Unit testing with 90%+ code coverage\n• Integration testing for all system components\n• Performance testing under load conditions\n• Security vulnerability assessment\n• User acceptance testing with stakeholders\n• Accessibility compliance testing\n\nQuality Gates:\n1. Requirements validation and sign-off\n2. Design review and architecture approval\n3. Code review and security scan completion\n4. Testing completion with defect resolution\n5. Performance benchmark achievement\n6. Documentation and training completion',
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
      { text: '.\n\n', style: { fontSize: 'base', fontFamily: 'Poppins' } },
      { text: 'Testing Protocols:', style: { bold: true, fontSize: 'lg', fontFamily: 'Poppins' } },
      { text: '\n• Unit testing with 90%+ code coverage\n• Integration testing for all system components\n• Performance testing under load conditions\n• Security vulnerability assessment\n• User acceptance testing with stakeholders\n• Accessibility compliance testing\n\n', style: { fontSize: 'base', fontFamily: 'Poppins' } },
      { text: 'Quality Gates:', style: { bold: true, fontSize: 'lg', fontFamily: 'Poppins' } },
      { text: '\n1. Requirements validation and sign-off\n2. Design review and architecture approval\n3. Code review and security scan completion\n4. Testing completion with defect resolution\n5. Performance benchmark achievement\n6. Documentation and training completion', style: { fontSize: 'base', fontFamily: 'Poppins' } }
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
    content: 'This comprehensive risk assessment identifies potential project risks and mitigation strategies. We evaluate technical risks, resource constraints, timeline dependencies, and external factors that may impact project success. Each risk is categorized by probability and impact, with detailed contingency plans developed for high-priority items.\n\nHigh-Risk Categories:\n• Technical complexity and integration challenges\n• Resource availability and skill gaps\n• Timeline dependencies on third-party vendors\n• Budget constraints and scope creep\n• Regulatory compliance requirements\n• Data security and privacy concerns\n\nMitigation Strategies:\n1. Early prototyping and proof-of-concept development\n2. Cross-training team members and backup resource planning\n3. Vendor management and alternative supplier identification\n4. Change control process and scope management\n5. Compliance audit and legal review procedures\n6. Security assessment and data protection measures',
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
      { text: ' developed for high-priority items.\n\n', style: { fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: 'High-Risk Categories:', style: { bold: true, fontSize: 'lg', fontFamily: 'Montserrat' } },
      { text: '\n• Technical complexity and integration challenges\n• Resource availability and skill gaps\n• Timeline dependencies on third-party vendors\n• Budget constraints and scope creep\n• Regulatory compliance requirements\n• Data security and privacy concerns\n\n', style: { fontSize: 'base', fontFamily: 'Montserrat' } },
      { text: 'Mitigation Strategies:', style: { bold: true, fontSize: 'lg', fontFamily: 'Montserrat' } },
      { text: '\n1. Early prototyping and proof-of-concept development\n2. Cross-training team members and backup resource planning\n3. Vendor management and alternative supplier identification\n4. Change control process and scope management\n5. Compliance audit and legal review procedures\n6. Security assessment and data protection measures', style: { fontSize: 'base', fontFamily: 'Montserrat' } }
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
    content: 'Our communication strategy ensures effective stakeholder engagement throughout the project lifecycle. This includes regular status updates, milestone reporting, issue escalation procedures, and change management communications. We establish clear communication channels, frequency schedules, and escalation matrices to maintain transparency and alignment.\n\nCommunication Channels:\n• Weekly status meetings with project team\n• Bi-weekly stakeholder progress reports\n• Monthly executive summary presentations\n• Issue tracking and resolution updates\n• Change request notifications and approvals\n• Training and support communications\n\nReporting Schedule:\n1. Daily: Team stand-up meetings and issue updates\n2. Weekly: Progress reports and milestone tracking\n3. Bi-weekly: Stakeholder presentations and feedback sessions\n4. Monthly: Executive summaries and budget reviews\n5. Quarterly: Strategic reviews and roadmap planning\n6. As needed: Issue escalation and change management',
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
      { text: '.\n\n', style: { fontSize: 'base', fontFamily: 'Nunito' } },
      { text: 'Communication Channels:', style: { bold: true, fontSize: 'lg', fontFamily: 'Nunito' } },
      { text: '\n• Weekly status meetings with project team\n• Bi-weekly stakeholder progress reports\n• Monthly executive summary presentations\n• Issue tracking and resolution updates\n• Change request notifications and approvals\n• Training and support communications\n\n', style: { fontSize: 'base', fontFamily: 'Nunito' } },
      { text: 'Reporting Schedule:', style: { bold: true, fontSize: 'lg', fontFamily: 'Nunito' } },
      { text: '\n1. Daily: Team stand-up meetings and issue updates\n2. Weekly: Progress reports and milestone tracking\n3. Bi-weekly: Stakeholder presentations and feedback sessions\n4. Monthly: Executive summaries and budget reviews\n5. Quarterly: Strategic reviews and roadmap planning\n6. As needed: Issue escalation and change management', style: { fontSize: 'base', fontFamily: 'Nunito' } }
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
    content: 'Comprehensive training and support services ensure successful system adoption and user proficiency. Our training program includes user documentation, hands-on workshops, video tutorials, and ongoing support through helpdesk services. We provide role-based training modules, certification programs, and continuous learning resources to maximize user productivity.\n\nTraining Components:\n• System overview and navigation training\n• Role-specific functionality workshops\n• Hands-on practice sessions and exercises\n• Video tutorials and self-paced learning modules\n• User documentation and quick reference guides\n• Certification programs for power users\n\nSupport Services:\n1. Helpdesk support with 24/7 availability\n2. Online knowledge base and FAQ resources\n3. Remote assistance and screen sharing sessions\n4. On-site support for critical issues\n5. Regular system updates and feature training\n6. User community forums and peer support',
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
      { text: '.\n\n', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } },
      { text: 'Training Components:', style: { bold: true, fontSize: 'lg', fontFamily: 'Source Sans Pro' } },
      { text: '\n• System overview and navigation training\n• Role-specific functionality workshops\n• Hands-on practice sessions and exercises\n• Video tutorials and self-paced learning modules\n• User documentation and quick reference guides\n• Certification programs for power users\n\n', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } },
      { text: 'Support Services:', style: { bold: true, fontSize: 'lg', fontFamily: 'Source Sans Pro' } },
      { text: '\n1. Helpdesk support with 24/7 availability\n2. Online knowledge base and FAQ resources\n3. Remote assistance and screen sharing sessions\n4. On-site support for critical issues\n5. Regular system updates and feature training\n6. User community forums and peer support', style: { fontSize: 'base', fontFamily: 'Source Sans Pro' } }
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
    content: 'Our compliance and security framework ensures adherence to industry standards and regulatory requirements. This includes data protection measures, access controls, audit trails, and regular security assessments. We implement industry best practices for cybersecurity, privacy protection, and regulatory compliance to safeguard sensitive information and maintain trust.\n\nSecurity Measures:\n• Multi-factor authentication and role-based access control\n• Data encryption at rest and in transit\n• Regular security audits and vulnerability assessments\n• Incident response and disaster recovery procedures\n• Compliance monitoring and reporting systems\n• Employee security awareness training programs\n\nCompliance Standards:\n1. GDPR compliance for data privacy and protection\n2. SOC 2 Type II certification for security controls\n3. ISO 27001 information security management\n4. HIPAA compliance for healthcare data handling\n5. PCI DSS for payment card data security\n6. Industry-specific regulatory requirements',
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
      { text: ' and maintain trust.\n\n', style: { fontSize: 'base', fontFamily: 'Ubuntu' } },
      { text: 'Security Measures:', style: { bold: true, fontSize: 'lg', fontFamily: 'Ubuntu' } },
      { text: '\n• Multi-factor authentication and role-based access control\n• Data encryption at rest and in transit\n• Regular security audits and vulnerability assessments\n• Incident response and disaster recovery procedures\n• Compliance monitoring and reporting systems\n• Employee security awareness training programs\n\n', style: { fontSize: 'base', fontFamily: 'Ubuntu' } },
      { text: 'Compliance Standards:', style: { bold: true, fontSize: 'lg', fontFamily: 'Ubuntu' } },
      { text: '\n1. GDPR compliance for data privacy and protection\n2. SOC 2 Type II certification for security controls\n3. ISO 27001 information security management\n4. HIPAA compliance for healthcare data handling\n5. PCI DSS for payment card data security\n6. Industry-specific regulatory requirements', style: { fontSize: 'base', fontFamily: 'Ubuntu' } }
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
    content: 'Key performance indicators and success metrics provide measurable outcomes for project evaluation and continuous improvement. We establish baseline measurements, target thresholds, and monitoring mechanisms to track progress and identify optimization opportunities. Regular performance reviews and data analysis ensure alignment with business objectives and drive strategic decision-making.\n\nKey Performance Indicators:\n• System uptime and availability (target: 99.9%)\n• Response time and performance benchmarks\n• User adoption and engagement metrics\n• Cost savings and ROI measurements\n• Customer satisfaction scores\n• Process efficiency improvements\n\nSuccess Metrics:\n1. Project delivery within budget and timeline\n2. System performance meeting or exceeding SLAs\n3. User training completion rates above 95%\n4. Reduction in manual processes by 60%\n5. Customer satisfaction scores above 4.5/5\n6. Measurable business value realization',
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
      { text: ' and drive strategic decision-making.\n\n', style: { fontSize: 'base', fontFamily: 'Work Sans' } },
      { text: 'Key Performance Indicators:', style: { bold: true, fontSize: 'lg', fontFamily: 'Work Sans' } },
      { text: '\n• System uptime and availability (target: 99.9%)\n• Response time and performance benchmarks\n• User adoption and engagement metrics\n• Cost savings and ROI measurements\n• Customer satisfaction scores\n• Process efficiency improvements\n\n', style: { fontSize: 'base', fontFamily: 'Work Sans' } },
      { text: 'Success Metrics:', style: { bold: true, fontSize: 'lg', fontFamily: 'Work Sans' } },
      { text: '\n1. Project delivery within budget and timeline\n2. System performance meeting or exceeding SLAs\n3. User training completion rates above 95%\n4. Reduction in manual processes by 60%\n5. Customer satisfaction scores above 4.5/5\n6. Measurable business value realization', style: { fontSize: 'base', fontFamily: 'Work Sans' } }
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