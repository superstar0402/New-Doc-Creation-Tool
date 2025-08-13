export interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PricingItem {
  id: string;
  item: string;
  quantity: number;
  description: string;
  price: number;
  extendedPrice: number;
}

export interface ProjectInfo {
  customerName: string;
  customerLogo?: File;
  projectName: string;
  startDate: string;
  projectOverview: string;
  technicalOverview: string;
  pricingTable: PricingItem[];
  hardwareComponents: FormattedContent[];
  servicesComponents: FormattedContent[];
  headerText: string;
  footerText: string;
}

export interface TextFormatting {
  fontFamily: string;
  fontSize: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface TextBlock {
  id: string;
  title: string;
  content: string;
  formattedContent?: FormattedContent[];
  category: string;
  isSelected: boolean;
  headerOptions?: string[];
  footerOptions?: string[];
  titleFormatting?: TextFormatting;
  contentFormatting?: TextFormatting;
}

export interface FormattedContent {
  text: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    fontFamily?: string;
  };
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