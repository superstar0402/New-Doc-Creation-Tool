export interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ProjectInfo {
  customerName: string;
  customerLogo?: File;
  projectName: string;
  startDate: string;
  projectOverview: string;
  technicalOverview: string;
  pricingTable: string;
  hardwareComponents: string;
  servicesComponents: string;
}

export interface TextBlock {
  id: string;
  title: string;
  content: string;
  category: string;
  isSelected: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  headerContent: string;
  footerContent: string;
  styles: Record<string, string>;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}