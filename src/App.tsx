import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';

import { WizardProgress } from './components/WizardProgress';
import { DocumentTypeSelector } from './components/DocumentTypeSelector';
import { ProjectInfoForm } from './components/ProjectInfoForm';
import { TextBlockSelector } from './components/TextBlockSelector';
import { DocumentPreview } from './components/DocumentPreview';
import { documentTypes, textBlocks as initialTextBlocks } from './data/mockData';
import { ProjectInfo, TextBlock, WizardStep, PricingItem, FormattedContent } from './types';

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
    
    if (item.style?.color || item.style?.fontSize) {
      const style = [];
      if (item.style?.color) style.push(`color: ${item.style.color}`);
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
    hardwareComponents: '',
    servicesComponents: ''
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
${projectInfo.startDate ? `**Start Date:** ${new Date(projectInfo.startDate).toLocaleDateString()}` : ''}

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
        content += `#### ${block.title}\n\n${block.content}\n\n`;
      });
    });

    if (projectInfo.hardwareComponents || projectInfo.servicesComponents || projectInfo.pricingTable.length > 0) {
      content += `\n## Pricing & Components\n\n`;
      
      if (projectInfo.hardwareComponents) {
        content += `### Hardware Components\n\n${projectInfo.hardwareComponents}\n\n`;
      }
      
      if (projectInfo.servicesComponents) {
        content += `### Services Components\n\n${projectInfo.servicesComponents}\n\n`;
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

    content += `\n---\n\n*Generated on ${new Date().toLocaleDateString()}*`;

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
          // For PDF, we'll create a simple HTML that can be printed to PDF
          const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${selectedDocumentType}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
    h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; }
    h3 { color: #1e3a8a; }
    h4 { color: #1e293b; }
    .header { text-align: center; margin-bottom: 40px; }
    .section { margin-bottom: 30px; }
    .block { background: #f8fafc; padding: 15px; margin: 10px 0; border-left: 4px solid #2563eb; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${selectedDocumentType.toUpperCase().replace('-', ' ')}</h1>
    ${projectInfo.customerName ? `<h2>${projectInfo.customerName}</h2>` : ''}
    ${projectInfo.projectName ? `<h3>${projectInfo.projectName}</h3>` : ''}
    ${projectInfo.startDate ? `<p><strong>Start Date:</strong> ${new Date(projectInfo.startDate).toLocaleDateString()}</p>` : ''}
  </div>

  <div class="section">
    <h2>Project Overview</h2>
    <div class="block">${projectInfo.projectOverview || 'No project overview provided.'}</div>
  </div>

  <div class="section">
    <h2>Technical Overview</h2>
    <div class="block">${projectInfo.technicalOverview || 'No technical overview provided.'}</div>
  </div>

  ${Object.entries(selectedBlocks.reduce((acc, block) => {
    if (!acc[block.category]) acc[block.category] = [];
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, TextBlock[]>)).map(([category, blocks]) => `
  <div class="section">
    <h2>${category}</h2>
    ${blocks.map(block => `
    <div class="block">
      <h4>${block.title}</h4>
      ${(block.headerOptions && block.headerOptions.some(opt => opt)) ? `<div class="text-xs text-gray-500 mb-1">Header: ${block.headerOptions.filter(Boolean).join(' | ')}</div>` : ''}
      <p>${block.formattedContent && block.formattedContent.length > 0 
        ? convertFormattedContentToHTML(block.formattedContent) 
        : block.content.replace(/\n/g, '<br>')}</p>
      ${(block.footerOptions && block.footerOptions.some(opt => opt)) ? `<div class="text-xs text-gray-500 mt-2">Footer: ${block.footerOptions.filter(Boolean).join(' | ')}</div>` : ''}
    </div>
    `).join('')}
  </div>
  `).join('')}

  ${(projectInfo.hardwareComponents || projectInfo.servicesComponents || projectInfo.pricingTable.length > 0) ? `
  <div class="section">
    <h2>Pricing & Components</h2>
    ${projectInfo.hardwareComponents ? `
    <div class="block">
      <h4>Hardware Components</h4>
      <p>${projectInfo.hardwareComponents}</p>
    </div>
    ` : ''}
    ${projectInfo.servicesComponents ? `
    <div class="block">
      <h4>Services Components</h4>
      <p>${projectInfo.servicesComponents}</p>
    </div>
    ` : ''}
    ${projectInfo.pricingTable.length > 0 ? `
    <div class="block">
      <h4>Pricing Structure</h4>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: left;">Item</th>
            <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: left;">Quantity</th>
            <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: right;">Price ($)</th>
            <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: right;">Extended Price ($)</th>
          </tr>
        </thead>
        <tbody>
          ${projectInfo.pricingTable.map(item => `
            <tr>
              <td style="border: 1px solid #e2e8f0; padding: 8px;">${item.item || 'N/A'}</td>
              <td style="border: 1px solid #e2e8f0; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid #e2e8f0; padding: 8px;">${item.description || 'N/A'}</td>
              <td style="border: 1px solid #e2e8f0; padding: 8px; text-align: right;">$${item.price.toFixed(2)}</td>
              <td style="border: 1px solid #e2e8f0; padding: 8px; text-align: right;">$${item.extendedPrice.toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr style="background-color: #f8fafc; font-weight: bold;">
            <td colspan="4" style="border: 1px solid #e2e8f0; padding: 8px; text-align: right;">Total:</td>
            <td style="border: 1px solid #e2e8f0; padding: 8px; text-align: right;">$${projectInfo.pricingTable.reduce((sum, item) => sum + item.extendedPrice, 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    ` : ''}
  </div>
  ` : ''}

  <div class="footer">
    <p><em>Generated on ${new Date().toLocaleDateString()}</em></p>
  </div>
</body>
</html>`;

          downloadFile(htmlContent, `${baseFilename}.html`, 'text/html');
          alert('HTML file generated! Open it in a browser and use "Print to PDF" to save as PDF.');
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
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: `${index + 1}. ${block.title}`, bold: true })]
              }));
              // Header options
              if (block.headerOptions && block.headerOptions.some(opt => opt)) {
                paragraphs.push(new Paragraph({
                  children: [new TextRun({ text: `Header: ${block.headerOptions.filter(Boolean).join(' | ')}`, italics: true, size: 18 })]
                }));
              }
              // Use formatted content if available, otherwise fall back to plain content
              if (block.formattedContent && block.formattedContent.length > 0) {
                paragraphs.push(new Paragraph({
                  children: convertFormattedContentToTextRuns(block.formattedContent)
                }));
              } else {
                paragraphs.push(new Paragraph({
                  children: [new TextRun({ text: block.content })]
                }));
              }
              // Footer options
              if (block.footerOptions && block.footerOptions.some(opt => opt)) {
                paragraphs.push(new Paragraph({
                  children: [new TextRun({ text: `Footer: ${block.footerOptions.filter(Boolean).join(' | ')}`, italics: true, size: 18 })]
                }));
              }
            });
            
            // Pricing Components
            if (projectInfo.hardwareComponents) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: "Hardware Components", bold: true })]
              }));
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: projectInfo.hardwareComponents })]
              }));
            }
            
            if (projectInfo.servicesComponents) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: "Services Components", bold: true })]
              }));
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: projectInfo.servicesComponents })]
              }));
            }
            
            if (projectInfo.pricingTable.length > 0) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: "Pricing Structure", bold: true })]
              }));
              
              // Create pricing table
              const tableRows = [];
              
              // Header row
              const headerRow = new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Item", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Quantity", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Price ($)", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Extended Price ($)", bold: true })] })] })
                ]
              });
              tableRows.push(headerRow);
              
              // Data rows
              projectInfo.pricingTable.forEach(item => {
                const dataRow = new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.item || 'N/A' })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.quantity.toString() })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.description || 'N/A' })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${item.price.toFixed(2)}` })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${item.extendedPrice.toFixed(2)}` })] })] })
                  ]
                });
                tableRows.push(dataRow);
              });
              
              // Total row
              const total = projectInfo.pricingTable.reduce((sum, item) => sum + item.extendedPrice, 0);
              const totalRow = new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Total", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "" })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "" })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "" })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `$${total.toFixed(2)}`, bold: true })] })] })
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
              children: [new TextRun({ text: `Generated on ${new Date().toLocaleDateString()}`, italics: true })]
            }));
            
            // Create document
            const doc = new Document({
              sections: [{
                properties: {},
                children: paragraphs
              }]
            });

            console.log('Creating DOCX blob...');
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
${index + 1}. ${block.title}
${block.headerOptions && block.headerOptions.some(opt => opt) ? `Header: ${block.headerOptions.filter(Boolean).join(' | ')}` : ''}
${block.formattedContent && block.formattedContent.length > 0 
  ? block.formattedContent.map(item => item.text).join('')
  : block.content}
${block.footerOptions && block.footerOptions.some(opt => opt) ? `Footer: ${block.footerOptions.filter(Boolean).join(' | ')}` : ''}
`).join('\n')}

Generated on ${new Date().toLocaleDateString()}
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
          // For Google Docs, we'll create a markdown file that can be imported
          downloadFile(content, `${baseFilename}.md`, 'text/markdown');
          alert('Markdown file generated! You can import this into Google Docs.');
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