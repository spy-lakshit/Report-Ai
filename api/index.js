// Minimal Vercel Serverless Function - AI Report Generator
let Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, Header, Footer, PageNumber, NumberFormat;

try {
    const docx = require('docx');
    Document = docx.Document;
    Packer = docx.Packer;
    Paragraph = docx.Paragraph;
    TextRun = docx.TextRun;
    AlignmentType = docx.AlignmentType;
    PageBreak = docx.PageBreak;
    Header = docx.Header;
    Footer = docx.Footer;
    PageNumber = docx.PageNumber;
    NumberFormat = docx.NumberFormat;
} catch (error) {
    console.error('DOCX package not available:', error.message);
}

const progressTracking = new Map();

// Extract project concepts
function extractProjectConcepts(projectTitle, projectDescription) {
    const title = projectTitle.toLowerCase();
    const description = projectDescription.toLowerCase();
    
    const concepts = {
        technologies: [],
        features: [],
        domain: 'software development'
    };
    
    // Simple technology detection
    if (description.includes('react')) concepts.technologies.push('React.js');
    if (description.includes('node')) concepts.technologies.push('Node.js');
    if (description.includes('python')) concepts.technologies.push('Python');
    if (description.includes('ai') || description.includes('machine learning')) {
        concepts.technologies.push('AI/ML');
        concepts.domain = 'artificial intelligence';
    }
    if (title.includes('e-commerce') || description.includes('e-commerce')) {
        concepts.domain = 'e-commerce';
    }
    
    // Simple feature detection
    if (description.includes('authentication')) concepts.features.push('user authentication');
    if (description.includes('payment')) concepts.features.push('payment processing');
    if (description.includes('dashboard')) concepts.features.push('admin dashboard');
    
    return concepts;
}

// Generate simple content
function generateSimpleContent(config) {
    const concepts = extractProjectConcepts(config.projectTitle, config.projectDescription);
    
    const content = `CHAPTER 1: INTRODUCTION TO ${config.projectTitle.toUpperCase()}

1.1 Project Overview

The ${config.projectTitle} project addresses challenges in ${concepts.domain}. ${config.projectDescription}

This project leverages ${concepts.technologies.join(', ') || 'modern technologies'} to create a comprehensive solution.

Key features include ${concepts.features.join(', ') || 'core functionality'} designed to meet user requirements.

1.2 Objectives

The main objectives of ${config.projectTitle} include:
- Developing a robust ${concepts.domain} solution
- Implementing ${concepts.features[0] || 'key functionality'}
- Ensuring scalability and performance
- Delivering a user-friendly interface

1.3 Methodology

The development approach follows systematic phases:
- Requirements analysis and planning
- System design and architecture
- Implementation using ${concepts.technologies[0] || 'appropriate technologies'}
- Testing and validation
- Deployment and maintenance

CHAPTER 2: LITERATURE REVIEW AND BACKGROUND

2.1 Current State of Technology

The ${concepts.domain} field has evolved significantly with advances in ${concepts.technologies.join(' and ') || 'technology'}. Current research focuses on improving ${concepts.features[0] || 'system functionality'}.

2.2 Existing Solutions

Analysis of existing solutions reveals opportunities for improvement in ${concepts.domain} applications. The ${config.projectTitle} project addresses these gaps through innovative approaches.

2.3 Theoretical Foundation

The theoretical foundation is built on established principles in ${concepts.domain} and modern software engineering practices.

CHAPTER 3: SYSTEM DESIGN AND IMPLEMENTATION

3.1 Architecture Overview

The ${config.projectTitle} system architecture is designed for scalability and maintainability. The design incorporates ${concepts.technologies.join(' and ') || 'modern technologies'}.

3.2 Implementation Details

Implementation involves developing ${concepts.features.join(', ') || 'core features'} using best practices in ${concepts.domain}.

3.3 Testing and Validation

Comprehensive testing ensures the system meets all requirements and performs reliably.

CHAPTER 4: RESULTS AND CONCLUSION

4.1 Results

The ${config.projectTitle} implementation successfully demonstrates ${concepts.features[0] || 'key functionality'} with excellent performance.

4.2 Conclusion

This project successfully addresses the challenges in ${concepts.domain} through innovative use of ${concepts.technologies.join(' and ') || 'technology'}.

REFERENCES

1. Industry standards and best practices in ${concepts.domain}
2. ${concepts.technologies[0] || 'Technology'} documentation and guidelines
3. Research papers on ${concepts.features[0] || 'system development'}
4. Performance analysis and optimization techniques
5. Software engineering principles and methodologies`;

    return content;
}

// Create simple DOCX
async function createSimpleDocx(config) {
    if (!Document) {
        throw new Error('DOCX package not available');
    }
    
    try {
        const content = generateSimpleContent(config);
        const lines = content.split('\n').filter(line => line.trim());
        
        const paragraphs = lines.map(line => {
            const trimmedLine = line.trim();
            const isHeading = trimmedLine.startsWith('CHAPTER') || trimmedLine.match(/^\d+\.\d+/);
            
            return new Paragraph({
                children: [new TextRun({
                    text: trimmedLine,
                    bold: isHeading,
                    size: isHeading ? 28 : 24,
                    font: "Times New Roman"
                })],
                alignment: trimmedLine.startsWith('CHAPTER') ? AlignmentType.CENTER : AlignmentType.LEFT,
                spacing: {
                    before: isHeading ? 360 : 120,
                    after: isHeading ? 240 : 120,
                    line: 360,
                    lineRule: "auto"
                }
            });
        });

        // Add cover page
        const coverPage = [
            new Paragraph({
                children: [new TextRun({ text: config.institution.toUpperCase(), bold: true, size: 32, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 720, after: 240 }
            }),
            new Paragraph({
                children: [new TextRun({ text: config.projectTitle.toUpperCase(), bold: true, size: 36, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 1440, after: 1440 }
            }),
            new Paragraph({
                children: [new TextRun({ text: `A ${config.reportType.toUpperCase()}`, bold: true, size: 28, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 720 }
            }),
            new Paragraph({
                children: [new TextRun({ text: config.studentName, bold: true, size: 28, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 }
            }),
            new Paragraph({
                children: [new TextRun({ text: config.course, bold: false, size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 720 }
            }),
            new Paragraph({
                children: [new TextRun({ text: config.supervisor, bold: true, size: 28, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 720 }
            })
        ];

        const doc = new Document({
            sections: [
                {
                    children: [...coverPage, new Paragraph({ children: [new PageBreak()] }), ...paragraphs],
                    properties: {
                        page: {
                            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
                        }
                    }
                }
            ]
        });

        return await Packer.toBuffer(doc);
    } catch (error) {
        console.error('DOCX creation error:', error);
        throw error;
    }
}

// Main handler
module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { method, url } = req;
        
        // Health check
        if (method === 'GET' && (url === '/api/health' || url === '/health')) {
            return res.json({ 
                status: 'OK', 
                message: 'AI Report Generator is running!',
                docxAvailable: !!Document,
                timestamp: new Date().toISOString()
            });
        }
        
        // Progress check
        if (method === 'GET' && url.includes('/progress/')) {
            const sessionId = url.split('/').pop();
            const progress = progressTracking.get(sessionId) || { progress: 0, status: 'Starting...' };
            return res.json(progress);
        }
        
        // Download
        if (method === 'GET' && url.includes('/download/')) {
            const sessionId = url.split('/').pop();
            const progressData = progressTracking.get(sessionId);
            
            if (!progressData || !progressData.reportData) {
                return res.status(404).json({ error: 'Report not found' });
            }
            
            const { content, filename } = progressData.reportData;
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.send(content);
        }
        
        // Generate report
        if (method === 'POST' && (url === '/api/generate-report' || url === '/generate-report')) {
            if (!Document) {
                return res.status(500).json({ error: 'DOCX package not available' });
            }
            
            const sessionId = Date.now().toString();
            const config = req.body;
            
            // Basic validation
            if (!config.projectTitle || !config.studentName) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            
            // Set defaults
            config.institution = config.institution || 'University';
            config.course = config.course || 'Computer Science';
            config.reportType = config.reportType || 'Project Report';
            config.supervisor = config.supervisor || 'Supervisor';
            config.projectDescription = config.projectDescription || 'A comprehensive project implementation.';
            
            // Start generation
            progressTracking.set(sessionId, { progress: 10, status: 'Starting generation...' });
            
            // Generate asynchronously
            setImmediate(async () => {
                try {
                    progressTracking.set(sessionId, { progress: 50, status: 'Generating content...' });
                    
                    const docxBuffer = await createSimpleDocx(config);
                    const filename = `${config.studentName.replace(/\s+/g, '_')}_${config.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Report.docx`;
                    
                    progressTracking.set(sessionId, {
                        progress: 100,
                        status: 'Report completed!',
                        reportData: { content: docxBuffer, filename }
                    });
                } catch (error) {
                    progressTracking.set(sessionId, {
                        progress: 0,
                        status: `Error: ${error.message}`,
                        error: true
                    });
                }
            });
            
            return res.json({ sessionId, message: 'Report generation started' });
        }
        
        return res.status(404).json({ error: 'Endpoint not found' });
        
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};