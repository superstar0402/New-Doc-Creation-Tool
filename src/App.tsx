import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, Header, Footer, ImageRun } from 'docx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { WizardProgress } from './components/WizardProgress';
import { DocumentTypeSelector } from './components/DocumentTypeSelector';
import { ProjectInfoForm } from './components/ProjectInfoForm';
import { TextBlockSelector } from './components/TextBlockSelector';
import { DocumentPreview } from './components/DocumentPreview';
import { documentTypes, textBlocks as initialTextBlocks } from './data/mockData';
import { ProjectInfo, TextBlock, WizardStep, PricingItem, FormattedContent, TextFormatting } from './types';

// Utility function to format date consistently in MM/DD/YYYY format
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
};

const wizardSteps: WizardStep[] = [
  { id: 1, title: 'Document Type', description: 'Choose template', completed: false },
  { id: 2, title: 'Project Info', description: 'Enter details', completed: false },
  { id: 3, title: 'Content Blocks', description: 'Select content', completed: false },
  { id: 4, title: 'Preview & Export', description: 'Generate document', completed: false }
];

// Helper function to convert formatted content to DOCX TextRuns
const convertFormattedContentToTextRuns = (formattedContent: FormattedContent[] | undefined): TextRun[] => {
  if (!formattedContent || formattedContent.length === 0) {
    return [new TextRun({ text: '' })];
  }

  return formattedContent.map((item) => {
    const textRunOptions: any = { text: item.text };
    
    if (item.style?.bold) textRunOptions.bold = true;
    if (item.style?.italic) textRunOptions.italics = true;
    if (item.style?.underline) textRunOptions.underline = {};
    if (item.style?.color) textRunOptions.color = item.style.color;
    if (item.style?.fontFamily) textRunOptions.font = item.style.fontFamily;
    if (item.style?.fontSize) {
      // Convert fontSize to docx size (in half-points)
      const sizeMap: { [key: string]: number } = {
        'xs': 16, // 8pt
        'sm': 20, // 10pt
        'base': 24, // 12pt
        'lg': 28, // 14pt
        'xl': 32, // 16pt
        '2xl': 36, // 18pt
        '3xl': 40  // 20pt
      };
      textRunOptions.size = sizeMap[item.style.fontSize] || 24;
    }
    
    return new TextRun(textRunOptions);
  });
};

// Helper function to convert formatted content to HTML
const convertFormattedContentToHTML = (formattedContent: FormattedContent[] | undefined): string => {
  if (!formattedContent || formattedContent.length === 0) {
    return '';
  }

  return formattedContent.map((item) => {
    let html = item.text;
    
    if (item.style?.bold) html = `<strong>${html}</strong>`;
    if (item.style?.italic) html = `<em>${html}</em>`;
    if (item.style?.underline) html = `<u>${html}</u>`;
    
    if (item.style?.fontSize || item.style?.fontFamily) {
      const style = [] as string[];
      // Note: color property is not available in the current interface
      if (item.style?.fontFamily) style.push(`font-family: ${item.style.fontFamily}`);
      if (item.style?.fontSize) {
        const sizeMap: { [key: string]: string } = {
          'xs': '0.75rem',
          'sm': '0.875rem',
          'base': '1rem',
          'lg': '1.125rem',
          'xl': '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        };
        style.push(`font-size: ${sizeMap[item.style.fontSize] || '1rem'}`);
      }
      html = `<span style="${style.join('; ')}">${html}</span>`;
    }
    
    return html;
  }).join('');
};

// Helper function to convert formatted content to plain text with formatting indicators
const convertFormattedContentToPlainText = (formattedContent: FormattedContent[] | undefined): string => {
  if (!formattedContent || formattedContent.length === 0) {
    return '';
  }

  return formattedContent.map((item) => {
    let text = item.text;
    
    // Add formatting indicators for plain text
    if (item.style?.bold) text = `**${text}**`;
    if (item.style?.italic) text = `*${text}*`;
    if (item.style?.underline) text = `_${text}_`;
    
    return text;
  }).join('');
};

// Build inline style string from TextFormatting
const buildInlineStyleFromFormatting = (fmt?: TextFormatting): string => {
  if (!fmt) return '';
  const style: string[] = [];
  if (fmt.fontFamily) style.push(`font-family: ${fmt.fontFamily}`);
  if (fmt.color) style.push(`color: ${fmt.color}`);
  if (fmt.bold) style.push('font-weight: 700');
  if (fmt.italic) style.push('font-style: italic');
  if (fmt.underline) style.push('text-decoration: underline');
  if (fmt.fontSize) {
    const sizeMap: { [key: string]: string } = {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    };
    style.push(`font-size: ${sizeMap[fmt.fontSize] || '1rem'}`);
  }
  return style.join('; ');
};

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    customerName: '',
    projectName: '',
    startDate: '',
    projectOverview: '',
    technicalOverview: '',
    pricingTable: [],
    hardwareComponents: [],
    servicesComponents: [],
    headerText: '',
    footerText: ''
  });
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>(initialTextBlocks);
  const [isExporting, setIsExporting] = useState(false);

  const selectedBlocks = textBlocks.filter(block => block.isSelected);

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedDocumentType !== '';
      case 1:
        // Check if required fields are filled (customerName and projectName are required)
        const customerName = projectInfo.customerName || '';
        const projectName = projectInfo.projectName || '';
        const isValid = customerName.trim().length > 0 && projectName.trim().length > 0;
        console.log('Validation check:', { 
          customerName, 
          projectName, 
          customerNameTrimmed: customerName.trim(), 
          projectNameTrimmed: projectName.trim(),
          customerNameLength: customerName.trim().length,
          projectNameLength: projectName.trim().length,
          isValid 
        });
        return isValid;
      case 2:
        return selectedBlocks.length > 0;
      default:
        return true;
    }
  };

  const generateDocumentContent = () => {
    const groupedBlocks = selectedBlocks.reduce((acc, block) => {
      if (!acc[block.category]) {
        acc[block.category] = [];
      }
      acc[block.category].push(block);
      return acc;
    }, {} as Record<string, TextBlock[]>);

    let content = `
# ${selectedDocumentType.toUpperCase().replace('-', ' ')}

${projectInfo.customerName ? `**Customer:** ${projectInfo.customerName}` : ''}
${projectInfo.projectName ? `**Project:** ${projectInfo.projectName}` : ''}
${projectInfo.startDate ? `**Start Date:** ${formatDate(projectInfo.startDate)}` : ''}

---

## Project Overview
${projectInfo.projectOverview || 'No project overview provided.'}

## Technical Overview
${projectInfo.technicalOverview || 'No technical overview provided.'}

---

## Content Sections
`;

    Object.entries(groupedBlocks).forEach(([category, blocks]) => {
      content += `\n### ${category}\n\n`;
      blocks.forEach((block, index) => {
        // Use formatted content if available, otherwise use plain content
        const blockContent = block.formattedContent && block.formattedContent.length > 0
          ? convertFormattedContentToPlainText(block.formattedContent)
          : block.content;
        content += `#### ${block.title}\n\n${blockContent}\n\n`;
      });
    });

    if (projectInfo.hardwareComponents.length > 0 || projectInfo.servicesComponents.length > 0 || projectInfo.pricingTable.length > 0) {
      content += `\n## Pricing & Components\n\n`;
      
      if (projectInfo.hardwareComponents.length > 0) {
        content += `### Hardware Components\n\n`;
        projectInfo.hardwareComponents.forEach(item => {
          content += `${convertFormattedContentToPlainText([item])}\n`;
        });
        content += `\n`;
      }
      
      if (projectInfo.servicesComponents.length > 0) {
        content += `### Services Components\n\n`;
        projectInfo.servicesComponents.forEach(item => {
          content += `${convertFormattedContentToPlainText([item])}\n`;
        });
        content += `\n`;
      }
      
      if (projectInfo.pricingTable.length > 0) {
        content += `### Pricing Structure\n\n`;
        content += `| Item | Quantity | Description | Price ($) | Extended Price ($) |\n`;
        content += `|------|----------|-------------|-----------|-------------------|\n`;
        
        projectInfo.pricingTable.forEach(item => {
          content += `| ${item.item || 'N/A'} | ${item.quantity} | ${item.description || 'N/A'} | $${item.price.toFixed(2)} | $${item.extendedPrice.toFixed(2)} |\n`;
        });
        
        const total = projectInfo.pricingTable.reduce((sum, item) => sum + item.extendedPrice, 0);
        content += `| **Total** | | | | **$${total.toFixed(2)}** |\n\n`;
      }
    }

    content += `\n---\n\n*Generated on ${formatDate(new Date().toISOString().split('T')[0])}*`;

    return content;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    
    try {
      const content = generateDocumentContent();
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const baseFilename = `${projectInfo.customerName || 'Document'}_${selectedDocumentType}_${timestamp}`;

      console.log('Starting export for format:', format);
      console.log('Document content length:', content.length);

      switch (format) {
        case 'pdf':
          try {
            console.log('Starting PDF generation...');
            
            // Create a temporary div to render the document content
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            tempDiv.style.width = '800px';
            tempDiv.style.padding = '40px';
            tempDiv.style.backgroundColor = 'white';
            tempDiv.style.fontFamily = 'Arial, sans-serif';
            tempDiv.style.lineHeight = '1.6';
            tempDiv.style.color = 'black';
            
            // Get font family from first selected block for PDF table
            const getTableFontFamily = () => {
              if (selectedBlocks.length > 0) {
                const firstBlock = selectedBlocks[0];
                // Try to get font family from content formatting first, then title formatting
                return firstBlock.contentFormatting?.fontFamily || 
                       firstBlock.titleFormatting?.fontFamily || 
                       'Arial';
              }
              return 'Arial';
            };
            
            const tableFontFamily = getTableFontFamily();
            
            // Build the HTML content for PDF - matching Word document format
            const htmlContent = `
              <div style="margin-bottom: 20px; text-align: center;">
                ${projectInfo.customerLogo ? `
                  <div style="margin-bottom: 15px;">
                    <img src="${URL.createObjectURL(projectInfo.customerLogo)}" alt="Customer Logo" style="max-width: 120px; max-height: 120px; object-fit: contain;" />
                  </div>
                ` : ''}
                <h1 style="color: #2563eb; margin: 0 0 15px 0; font-size: 24px; font-weight: bold; text-align: left;">${selectedDocumentType.toUpperCase().replace('-', ' ')}</h1>
                <p style="margin: 5px 0; text-align: left;">Customer: ${projectInfo.customerName || 'N/A'}</p>
                <p style="margin: 5px 0; text-align: left;">Project: ${projectInfo.projectName || 'N/A'}</p>
                ${projectInfo.startDate ? `<p style="margin: 5px 0; text-align: left;">Start Date: ${formatDate(projectInfo.startDate)}</p>` : ''}
              </div>

              <div style="margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin: 20px 0 10px 0; font-size: 18px; font-weight: bold;">Project Overview</h2>
                <p style="margin: 5px 0;">${projectInfo.projectOverview || 'No project overview provided.'}</p>
              </div>

              <div style="margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin: 20px 0 10px 0; font-size: 18px; font-weight: bold;">Technical Overview</h2>
                <p style="margin: 5px 0;">${projectInfo.technicalOverview || 'No technical overview provided.'}</p>
              </div>

              ${selectedBlocks.map((block, index) => {
                const titleStyle = buildInlineStyleFromFormatting(block.titleFormatting);
                const contentStyle = buildInlineStyleFromFormatting(block.contentFormatting);
                const headerHTML = (block.headerOptions && block.headerOptions.some(opt => opt)) ? `<p style="margin: 5px 0; font-style: italic; color: #6b7280; font-size: 12px;">Header: ${block.headerOptions.filter(Boolean).join(' | ')}</p>` : '';
                const footerHTML = (block.footerOptions && block.footerOptions.some(opt => opt)) ? `<p style="margin: 5px 0; font-style: italic; color: #6b7280; font-size: 12px;">Footer: ${block.footerOptions.filter(Boolean).join(' | ')}</p>` : '';
                const contentHTML = (block.formattedContent && block.formattedContent.length > 0)
                  ? convertFormattedContentToHTML(block.formattedContent)
                  : block.content.replace(/\n/g, '<br>');
                return `
                <div style="margin-bottom: 15px;">
                  <p style="margin: 5px 0;"><span style="${titleStyle}">${block.title}</span></p>
                  ${headerHTML}
                  <p style="margin: 5px 0; ${contentStyle}">${contentHTML}</p>
                  ${footerHTML}
                </div>`;
              }).join('')}

              ${(projectInfo.hardwareComponents.length > 0 || projectInfo.servicesComponents.length > 0 || projectInfo.pricingTable.length > 0) ? `
              <div style="margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin: 20px 0 10px 0; font-size: 18px; font-weight: bold;">Pricing & Components</h2>
                ${projectInfo.hardwareComponents.length > 0 ? `
                <div style="margin-bottom: 15px;">
                  <h3 style="margin: 10px 0 5px 0; font-size: 16px; font-weight: bold;">Hardware Components</h3>
                  <div style="margin: 5px 0;">
                    ${projectInfo.hardwareComponents.map(item => `
                      <div style="margin: 2px 0;">
                        ${convertFormattedContentToHTML([item])}
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}
                ${projectInfo.servicesComponents.length > 0 ? `
                <div style="margin-bottom: 15px;">
                  <h3 style="margin: 10px 0 5px 0; font-size: 16px; font-weight: bold;">Services Components</h3>
                  <div style="margin: 5px 0;">
                    ${projectInfo.servicesComponents.map(item => `
                      <div style="margin: 2px 0;">
                        ${convertFormattedContentToHTML([item])}
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}
                ${projectInfo.pricingTable.length > 0 ? `
                <div style="margin-bottom: 15px;">
                  <h3 style="margin: 10px 0 5px 0; font-size: 16px; font-weight: bold;">Pricing Structure</h3>
                  <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; font-family: ${tableFontFamily}, sans-serif;">
                    <thead>
                      <tr style="background-color: #dc2626;">
                        <th style="border: 1px solid #e2e8f0; padding: 6px; text-align: left; font-family: ${tableFontFamily}, sans-serif; color: white;">Item</th>
                        <th style="border: 1px solid #e2e8f0; padding: 6px; text-align: left; font-family: ${tableFontFamily}, sans-serif; color: white;">Quantity</th>
                        <th style="border: 1px solid #e2e8f0; padding: 6px; text-align: left; font-family: ${tableFontFamily}, sans-serif; color: white;">Description</th>
                        <th style="border: 1px solid #e2e8f0; padding: 6px; text-align: right; font-family: ${tableFontFamily}, sans-serif; color: white;">Price ($)</th>
                        <th style="border: 1px solid #e2e8f0; padding: 6px; text-align: right; font-family: ${tableFontFamily}, sans-serif; color: white;">Extended Price ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${projectInfo.pricingTable.map(item => `
                        <tr>
                          <td style="border: 1px solid #e2e8f0; padding: 6px; font-family: ${tableFontFamily}, sans-serif;">${item.item || 'N/A'}</td>
                          <td style="border: 1px solid #e2e8f0; padding: 6px; font-family: ${tableFontFamily}, sans-serif;">${item.quantity}</td>
                          <td style="border: 1px solid #e2e8f0; padding: 6px; font-family: ${tableFontFamily}, sans-serif;">${item.description || 'N/A'}</td>
                          <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: right; font-family: ${tableFontFamily}, sans-serif;">$${item.price.toFixed(2)}</td>
                          <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: right; font-family: ${tableFontFamily}, sans-serif;">$${item.extendedPrice.toFixed(2)}</td>
                        </tr>
                      `).join('')}
                      <tr style="background-color: #dc2626; font-weight: bold;">
                        <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: left; font-family: ${tableFontFamily}, sans-serif; color: white;">Total:</td>
                        <td style="border: 1px solid #e2e8f0; padding: 6px; font-family: ${tableFontFamily}, sans-serif; color: white;"></td>
                        <td style="border: 1px solid #e2e8f0; padding: 6px; font-family: ${tableFontFamily}, sans-serif; color: white;"></td>
                        <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: right; font-family: ${tableFontFamily}, sans-serif; color: white;"></td>
                        <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: right; font-family: ${tableFontFamily}, sans-serif; color: white;">$${projectInfo.pricingTable.reduce((sum, item) => sum + item.extendedPrice, 0).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                ` : ''}
              </div>
              ` : ''}

              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                <p style="margin: 0;"><em>Generated on ${formatDate(new Date().toISOString().split('T')[0])}</em></p>
              </div>
            `;
            
            tempDiv.innerHTML = htmlContent;
            document.body.appendChild(tempDiv);
            
            // Convert HTML to canvas, then to PDF
            const canvas = await html2canvas(tempDiv, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              width: 800,
              height: tempDiv.scrollHeight
            });
            
            // Remove the temporary div
            document.body.removeChild(tempDiv);
            
            // Create PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 10; // 10mm top margin
            
            // Add first page
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20); // Account for margins
            
            // Add additional pages if needed
            while (heightLeft >= 0) {
              position = heightLeft - imgHeight + 10;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
              heightLeft -= (pdfHeight - 20);
            }
            
            // Save the PDF
            pdf.save(`${baseFilename}.pdf`);
            console.log('PDF generated successfully');
            
          } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
          }
          break;

        case 'docx':
          try {
            console.log('Starting DOCX generation...');
            
            // Create paragraphs array
            const paragraphs = [];
            
            // Title
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: selectedDocumentType.toUpperCase().replace('-', ' '), bold: true })]
            }));
            
            // Customer Logo (if available)
            if (projectInfo.customerLogo) {
              console.log('Customer logo found:', projectInfo.customerLogo.name, projectInfo.customerLogo.type, projectInfo.customerLogo.size);
              
              // Check if the image format is supported
              const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
              if (!supportedFormats.includes(projectInfo.customerLogo.type)) {
                console.warn('Unsupported image format:', projectInfo.customerLogo.type);
              }
              
              try {
                // Convert the logo file to Uint8Array for embedding
                const arrayBuffer = await projectInfo.customerLogo.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                console.log('Logo converted to Uint8Array, size:', uint8Array.length);
                
                // Create image element to get dimensions
                const img = new Image();
                const imgPromise = new Promise<void>((resolve, reject) => {
                  img.onload = () => resolve();
                  img.onerror = () => reject(new Error('Failed to load image'));
                });
                
                img.src = URL.createObjectURL(projectInfo.customerLogo);
                await imgPromise;
                
                // Calculate aspect ratio to maintain proportions
                const aspectRatio = img.width / img.height;
                const maxWidth = 200;
                const maxHeight = 200;
                let width = maxWidth;
                let height = maxHeight;
                
                if (aspectRatio > 1) {
                  // Landscape image
                  height = maxWidth / aspectRatio;
                } else {
                  // Portrait image
                  width = maxHeight * aspectRatio;
                }
                
                // Add the image to the document
                const imageParagraph = new Paragraph({
                  children: [
                    new ImageRun({
                      data: uint8Array,
                      transformation: {
                        width: Math.round(width),
                        height: Math.round(height),
                      }
                    }),
                  ],
                  alignment: AlignmentType.LEFT,
                });
                paragraphs.push(imageParagraph);
                console.log('Logo paragraph added to document with dimensions:', width, 'x', height);
                
                // Clean up the object URL
                URL.revokeObjectURL(img.src);
              } catch (error) {
                console.error('Could not embed customer logo in DOCX:', error);
                console.error('Error details:', error);
                
                // Add a text-based fallback indicating the logo was included
                paragraphs.push(new Paragraph({
                  children: [new TextRun({ 
                    text: `[Customer Logo: ${projectInfo.customerLogo.name}]`, 
                    bold: true,
                    color: '666666'
                  })],
                  alignment: AlignmentType.CENTER,
                }));
                console.log('Added text fallback for logo');
              }
            } else {
              console.log('No customer logo found');
            }
            
            // Customer and Project info
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: `Customer: ${projectInfo.customerName || 'N/A'}` })]
            }));
            
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: `Project: ${projectInfo.projectName || 'N/A'}` })]
            }));
            
            // Project Overview
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: "Project Overview", bold: true })]
            }));
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: projectInfo.projectOverview || 'No project overview provided.' })]
            }));
            
            // Technical Overview
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: "Technical Overview", bold: true })]
            }));
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: projectInfo.technicalOverview || 'No technical overview provided.' })]
            }));
            
            // Content Blocks
            selectedBlocks.forEach((block, index) => {
              // Title with formatting
              const titleRuns: TextRun[] = [];
              const titleOptions: any = { text: block.title };
              if (block.titleFormatting?.bold) titleOptions.bold = true;
              if (block.titleFormatting?.italic) titleOptions.italics = true;
              if (block.titleFormatting?.underline) titleOptions.underline = {};
              if (block.titleFormatting?.color) titleOptions.color = block.titleFormatting.color;  
              if (block.titleFormatting?.fontFamily) titleOptions.font = block.titleFormatting.fontFamily;
              if (block.titleFormatting?.fontSize) {
                const sizeMap: { [key: string]: number } = { xs: 16, sm: 20, base: 24, lg: 28, xl: 32, '2xl': 36, '3xl': 40 };
                titleOptions.size = sizeMap[block.titleFormatting.fontSize] || 24;
              }
              titleRuns.push(new TextRun(titleOptions));
              paragraphs.push(new Paragraph({ children: titleRuns }));

              // Header options
              if (block.headerOptions && block.headerOptions.some(opt => opt)) {
                paragraphs.push(new Paragraph({
                  children: [new TextRun({ text: `Header: ${block.headerOptions.filter(Boolean).join(' | ')}`, italics: true, size: 18, color: '888888' })]
                }));
              }

              // Content with formatting when no formattedContent
              if (block.formattedContent && block.formattedContent.length > 0) {
                paragraphs.push(new Paragraph({
                  children: convertFormattedContentToTextRuns(block.formattedContent)
                }));
              } else {
                const contentOptions: any = { text: block.content };
                if (block.contentFormatting?.bold) contentOptions.bold = true;
                if (block.contentFormatting?.italic) contentOptions.italics = true;
                if (block.contentFormatting?.underline) contentOptions.underline = {};
                if (block.contentFormatting?.color) contentOptions.color = block.contentFormatting.color;
                if (block.contentFormatting?.fontFamily) contentOptions.font = block.contentFormatting.fontFamily;
                if (block.contentFormatting?.fontSize) {
                  const sizeMap: { [key: string]: number } = { xs: 16, sm: 20, base: 24, lg: 28, xl: 32, '2xl': 36, '3xl': 40 };
                  contentOptions.size = sizeMap[block.contentFormatting.fontSize] || 24;
                }
                paragraphs.push(new Paragraph({ children: [new TextRun(contentOptions)] }));
              }

              // Footer options
              if (block.footerOptions && block.footerOptions.some(opt => opt)) {
                paragraphs.push(new Paragraph({
                  children: [new TextRun({ text: `Footer: ${block.footerOptions.filter(Boolean).join(' | ')}`, italics: true, size: 18, color: '888888' })]
                }));
              }
            });
            
            // Pricing Components
            if (projectInfo.hardwareComponents.length > 0) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: "Hardware Components", bold: true })]
              }));
              projectInfo.hardwareComponents.forEach(item => {
                const textRuns = convertFormattedContentToTextRuns([item]);
                paragraphs.push(new Paragraph({
                  children: textRuns
                }));
              });
            }
            
            if (projectInfo.servicesComponents.length > 0) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: "Services Components", bold: true })]
              }));
              projectInfo.servicesComponents.forEach(item => {
                const textRuns = convertFormattedContentToTextRuns([item]);
                paragraphs.push(new Paragraph({
                  children: textRuns
                }));
              });
            }
            
            if (projectInfo.pricingTable.length > 0) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: "Pricing Structure", bold: true })]
              }));
              
              // Get font family from first selected block
              const getTableFontFamily = () => {
                if (selectedBlocks.length > 0) {
                  const firstBlock = selectedBlocks[0];
                  // Try to get font family from content formatting first, then title formatting
                  return firstBlock.contentFormatting?.fontFamily || 
                         firstBlock.titleFormatting?.fontFamily || 
                         'Arial';
                }
                return 'Arial';
              };
              
              const tableFontFamily = getTableFontFamily();
              
              // Create pricing table
              const tableRows = [];
              
              // Header row
              const headerRow = new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Item", bold: true, font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Quantity", bold: true, font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Price ($)", bold: true, font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Extended Price ($)", bold: true, font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  })
                ]
              });
              tableRows.push(headerRow);
              
              // Data rows
              projectInfo.pricingTable.forEach(item => {
                const dataRow = new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.item || 'N/A', font: tableFontFamily })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.quantity.toString(), font: tableFontFamily })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.description || 'N/A', font: tableFontFamily })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${item.price.toFixed(2)}`, font: tableFontFamily })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${item.extendedPrice.toFixed(2)}`, font: tableFontFamily })] })] })
                  ]
                });
                tableRows.push(dataRow);
              });
              
              // Total row
              const total = projectInfo.pricingTable.reduce((sum, item) => sum + item.extendedPrice, 0);
              const totalRow = new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "Total", bold: true, font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "", font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "", font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "", font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: `$${total.toFixed(2)}`, bold: true, font: tableFontFamily, color: "FFFFFF" })] })],
                    shading: { fill: "DC2626" }
                  })
                ]
              });
              tableRows.push(totalRow);
              
              const pricingTable = new Table({
                rows: tableRows,
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
              });
              
              paragraphs.push(pricingTable);
            }
            
            // Footer
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: `Generated on ${formatDate(new Date().toISOString().split('T')[0])}`, italics: true })]
            }));
            
            // Create document with header/footer if provided
            const doc = new Document({
              sections: [{
                properties: {},
                headers: projectInfo.headerText ? { default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: projectInfo.headerText, size: 18, color: '666666' })] })] }) } : undefined,
                footers: projectInfo.footerText ? { default: new Footer({ children: [new Paragraph({ children: [new TextRun({ text: projectInfo.footerText, size: 18, color: '666666' })] })] }) } : undefined,
                children: paragraphs
              }]
            });

            console.log('Creating DOCX blob...');
            console.log('Document structure:', {
              paragraphs: paragraphs.length,
              hasLogo: projectInfo.customerLogo ? true : false
            });
            const blob = await Packer.toBlob(doc);
            console.log('DOCX blob created, size:', blob.size);
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${baseFilename}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log('DOCX file downloaded successfully');
          } catch (docxError) {
            console.error('DOCX generation error:', docxError);
            console.error('Error details:', (docxError as Error).message, (docxError as Error).stack);
            
            // Create a simple text file as fallback
            const textContent = `
${selectedDocumentType.toUpperCase().replace('-', ' ')}

Customer: ${projectInfo.customerName || 'N/A'}
Project: ${projectInfo.projectName || 'N/A'}

PROJECT OVERVIEW
${projectInfo.projectOverview || 'No project overview provided.'}

TECHNICAL OVERVIEW
${projectInfo.technicalOverview || 'No technical overview provided.'}

CONTENT BLOCKS
${selectedBlocks.map((block, index) => `
${block.title}
${block.headerOptions && block.headerOptions.some(opt => opt) ? `Header: ${block.headerOptions.filter(Boolean).join(' | ')}` : ''}
${block.formattedContent && block.formattedContent.length > 0 
  ? block.formattedContent.map(item => item.text).join('')
  : block.content}
${block.footerOptions && block.footerOptions.some(opt => opt) ? `Footer: ${block.footerOptions.filter(Boolean).join(' | ')}` : ''}
`).join('\n')}

Generated on ${formatDate(new Date().toISOString().split('T')[0])}
`;

            // Create a simple DOCX as fallback
            const fallbackDoc = new Document({
              sections: [{
                properties: {},
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: selectedDocumentType.toUpperCase().replace('-', ' '), bold: true })]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: `Customer: ${projectInfo.customerName || 'N/A'}` })]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: `Project: ${projectInfo.projectName || 'N/A'}` })]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: projectInfo.projectOverview || 'No project overview provided.' })]
                  })
                ]
              }]
            });
            
            const fallbackBlob = await Packer.toBlob(fallbackDoc);
            const fallbackUrl = URL.createObjectURL(fallbackBlob);
            const fallbackLink = document.createElement('a');
            fallbackLink.href = fallbackUrl;
            fallbackLink.download = `${baseFilename}.docx`;
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            document.body.removeChild(fallbackLink);
            URL.revokeObjectURL(fallbackUrl);
            
            alert('DOCX generation failed. A simplified DOCX file has been created instead.');
          }
          break;

                case 'gdocs':
          try {
            console.log('Starting Google Docs generation...');
            
            // Get font family from first selected block for Google Docs table
            const getTableFontFamily = () => {
              if (selectedBlocks.length > 0) {
                const firstBlock = selectedBlocks[0];
                // Try to get font family from content formatting first, then title formatting
                return firstBlock.contentFormatting?.fontFamily || 
                       firstBlock.titleFormatting?.fontFamily || 
                       'Arial';
              }
              return 'Arial';
            };
            
            const tableFontFamily = getTableFontFamily();
            
            // Generate HTML optimized for Google Docs import
            const gdocsHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${selectedDocumentType}</title>
  <style>
    body { 
      font-family: 'Arial', sans-serif; 
      line-height: 1.6; 
      margin: 40px; 
      color: #333;
    }
    h1 { 
      color: #2563eb; 
      font-size: 24px; 
      font-weight: bold; 
      margin-bottom: 20px;
    }
    h2 { 
      color: #1e40af; 
      font-size: 18px; 
      font-weight: bold; 
      margin: 20px 0 10px 0;
    }
    h3 { 
      color: #1e3a8a; 
      font-size: 16px; 
      font-weight: bold; 
      margin: 15px 0 8px 0;
    }
    p { 
      margin: 8px 0; 
    }
    .header-info {
      margin-bottom: 20px;
    }
    .section {
      margin-bottom: 20px;
    }
    .content-block {
      margin-bottom: 15px;
    }
    .header-option {
      font-style: italic; 
      color: #6b7280; 
      font-size: 12px; 
      margin: 5px 0;
    }
    .footer-option {
      font-style: italic; 
      color: #6b7280; 
      font-size: 12px; 
      margin: 5px 0;
    }
    table {
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 10px; 
      font-size: 12px;
    }
    th, td {
      border: 1px solid #e2e8f0; 
      padding: 6px; 
      text-align: left;
    }
    th {
      background-color: #f8fafc;
    }
    .total-row {
      background-color: #f8fafc; 
      font-weight: bold;
    }
    .footer {
      text-align: center; 
      margin-top: 40px; 
      padding-top: 20px; 
      border-top: 1px solid #e2e8f0; 
      color: #64748b; 
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header-info">
    <h1>${selectedDocumentType.toUpperCase().replace('-', ' ')}</h1>
    <p><strong>Customer:</strong> ${projectInfo.customerName || 'N/A'}</p>
    <p><strong>Project:</strong> ${projectInfo.projectName || 'N/A'}</p>
    ${projectInfo.startDate ? `<p><strong>Start Date:</strong> ${formatDate(projectInfo.startDate)}</p>` : ''}
  </div>

  <div class="section">
    <h2>Project Overview</h2>
    <p>${projectInfo.projectOverview || 'No project overview provided.'}</p>
  </div>

  <div class="section">
    <h2>Technical Overview</h2>
    <p>${projectInfo.technicalOverview || 'No technical overview provided.'}</p>
  </div>

  ${selectedBlocks.map((block, index) => {
    const titleStyle = buildInlineStyleFromFormatting(block.titleFormatting);
    const contentStyle = buildInlineStyleFromFormatting(block.contentFormatting);
    const headerHTML = (block.headerOptions && block.headerOptions.some(opt => opt)) ? `<p class="header-option">Header: ${block.headerOptions.filter(Boolean).join(' | ')}</p>` : '';
    const footerHTML = (block.footerOptions && block.footerOptions.some(opt => opt)) ? `<p class="footer-option">Footer: ${block.footerOptions.filter(Boolean).join(' | ')}</p>` : '';
    const contentHTML = (block.formattedContent && block.formattedContent.length > 0)
      ? convertFormattedContentToHTML(block.formattedContent)
      : block.content.replace(/\n/g, '<br>');
    return `
    <div class="content-block">
      <p><span style="${titleStyle}"><strong>${block.title}</strong></span></p>
      ${headerHTML}
      <p style="${contentStyle}">${contentHTML}</p>
      ${footerHTML}
    </div>`;
  }).join('')}

  ${(projectInfo.hardwareComponents.length > 0 || projectInfo.servicesComponents.length > 0 || projectInfo.pricingTable.length > 0) ? `
  <div class="section">
    <h2>Pricing & Components</h2>
    ${projectInfo.hardwareComponents.length > 0 ? `
    <div class="content-block">
      <h3>Hardware Components</h3>
      <div>
        ${projectInfo.hardwareComponents.map(item => `
          <p>${convertFormattedContentToHTML([item])}</p>
        `).join('')}
      </div>
    </div>
    ` : ''}
    ${projectInfo.servicesComponents.length > 0 ? `
    <div class="content-block">
      <h3>Services Components</h3>
      <div>
        ${projectInfo.servicesComponents.map(item => `
          <p>${convertFormattedContentToHTML([item])}</p>
        `).join('')}
      </div>
    </div>
    ` : ''}
    ${projectInfo.pricingTable.length > 0 ? `
    <div class="content-block">
      <h3>Pricing Structure</h3>
      <table style="font-family: ${tableFontFamily}, sans-serif;">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Description</th>
            <th style="text-align: right;">Price ($)</th>
            <th style="text-align: right;">Extended ($)</th>
          </tr>
        </thead>
        <tbody>
          ${projectInfo.pricingTable.map(item => `
            <tr>
              <td>${item.item || 'N/A'}</td>
              <td>${item.quantity}</td>
              <td>${item.description || 'N/A'}</td>
              <td style="text-align: right;">$${item.price.toFixed(2)}</td>
              <td style="text-align: right;">$${item.extendedPrice.toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="4" style="text-align: right;">Total:</td>
            <td style="text-align: right;">$${projectInfo.pricingTable.reduce((sum, item) => sum + item.extendedPrice, 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    ` : ''}
  </div>
  ` : ''}

  <div class="footer">
    <p><em>Generated on ${formatDate(new Date().toISOString().split('T')[0])}</em></p>
  </div>
</body>
</html>`;

            // Create a .gdoc file (which is actually a text file with a Google Docs URL)
            const gdocContent = `{"url": "https://docs.google.com/document/d/placeholder", "doc_id": "placeholder"}`;
            
            // Save as .gdoc file
            downloadFile(gdocContent, `${baseFilename}.gdoc`, 'application/vnd.google-apps.document');
            
            // Also save the HTML version for easy import
            downloadFile(gdocsHtml, `${baseFilename}_for_import.html`, 'text/html');
            
            // Provide instructions for creating Google Doc
//             const instructions = `
// Google Docs file generated successfully!

// To create a Google Doc:
// 1. Open Google Docs (docs.google.com)
// 2. Click "File" → "Open"
// 3. Click "Upload" tab
// 4. Drag and drop the "${baseFilename}_for_import.html" file
// 5. Google Docs will convert it to a native Google Doc format

// The .gdoc file is also saved for reference.
//             `;
            
            // alert(instructions);
            console.log('Google Docs files generated successfully');
            
          } catch (error) {
            console.error('Error generating Google Docs file:', error);
            alert('Error generating Google Docs file. Please try again.');
          }
          break;

        default:
          // Default to plain text
          downloadFile(content, `${baseFilename}.txt`, 'text/plain');
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      console.error('Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack,
        format: format
      });
      alert(`Error exporting document as ${format.toUpperCase()}. Please try again. Error: ${(error as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <DocumentTypeSelector
            documentTypes={documentTypes}
            selectedType={selectedDocumentType}
            onTypeSelect={setSelectedDocumentType}
          />
        );
      case 1:
        return (
          <ProjectInfoForm
            projectInfo={projectInfo}
            onInfoChange={setProjectInfo}
          />
        );
      case 2:
        return (
          <TextBlockSelector
            textBlocks={textBlocks}
            onBlocksChange={setTextBlocks}
          />
        );
      case 3:
        return (
          <DocumentPreview
            projectInfo={projectInfo}
            selectedBlocks={selectedBlocks}
            documentType={selectedDocumentType}
            onExport={handleExport}
            isExporting={isExporting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Document Creation Tool
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Create professional proposals and statements of work with ease
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full border border-gray-200">
                Step {currentStep + 1} of {wizardSteps.length}
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }}
                ></div>
              </div>
              {/* <div className="text-sm text-gray-600 bg-white/60 px-4 py-2 rounded-full border border-gray-200">
                <span className="font-medium">Contact Dmytro:</span> plyskadmytro1@gmail.com
              </div> */}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <WizardProgress steps={wizardSteps} currentStep={currentStep} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="min-h-[600px]">
          {renderCurrentStep()}
        </div>
      </main>

      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-white/20 px-4 py-6 sm:px-6 lg:px-8 sticky bottom-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`group flex items-center px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-200 hover:-translate-y-0.5'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {wizardSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-primary-500 shadow-lg'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep < wizardSteps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`group flex items-center px-8 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                canProceed()
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          ) : (
            <div className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Ready to export!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;