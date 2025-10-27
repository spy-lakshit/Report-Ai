// Dynamic AI Report Generator API - Vercel Serverless Function
const { Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, Header, Footer, PageNumber, NumberFormat, TabStopType, LeaderType } = require('docx');

const progressTracking = new Map();

// Extract key technologies and concepts from project description
function extractProjectConcepts(projectTitle, projectDescription) {
    const title = projectTitle.toLowerCase();
    const description = projectDescription.toLowerCase();
    
    const concepts = {
        technologies: [],
        features: [],
        domain: '',
        challenges: [],
        benefits: []
    };
    
    // Technology detection
    if (description.includes('react')) concepts.technologies.push('React.js');
    if (description.includes('node') || description.includes('nodejs')) concepts.technologies.push('Node.js');
    if (description.includes('python')) concepts.technologies.push('Python');
    if (description.includes('java')) concepts.technologies.push('Java');
    if (description.includes('machine learning') || description.includes('ml')) concepts.technologies.push('Machine Learning');
    if (description.includes('ai') || description.includes('artificial intelligence')) concepts.technologies.push('Artificial Intelligence');
    if (description.includes('database') || description.includes('mysql') || description.includes('mongodb')) concepts.technologies.push('Database Systems');
    if (description.includes('api')) concepts.technologies.push('REST APIs');
    if (description.includes('blockchain')) concepts.technologies.push('Blockchain');
    if (description.includes('mobile') || description.includes('android') || description.includes('ios')) concepts.technologies.push('Mobile Development');
    
    // Feature detection
    if (description.includes('authentication')) concepts.features.push('user authentication');
    if (description.includes('payment')) concepts.features.push('payment processing');
    if (description.includes('cart') || description.includes('shopping')) concepts.features.push('shopping cart functionality');
    if (description.includes('recommendation')) concepts.features.push('recommendation system');
    if (description.includes('dashboard')) concepts.features.push('admin dashboard');
    if (description.includes('real-time')) concepts.features.push('real-time processing');
    if (description.includes('security')) concepts.features.push('security measures');
    if (description.includes('analytics')) concepts.features.push('data analytics');
    
    // Domain detection
    if (title.includes('e-commerce') || description.includes('e-commerce') || description.includes('shopping')) {
        concepts.domain = 'e-commerce';
        concepts.challenges = ['scalable product catalog', 'secure payment processing', 'inventory management', 'user experience optimization'];
        concepts.benefits = ['increased sales conversion', 'improved customer satisfaction', 'streamlined operations', 'enhanced security'];
    } else if (title.includes('ai') || title.includes('machine learning') || description.includes('machine learning')) {
        concepts.domain = 'artificial intelligence';
        concepts.challenges = ['data preprocessing', 'model accuracy', 'computational efficiency', 'algorithm selection'];
        concepts.benefits = ['automated decision making', 'predictive analytics', 'improved accuracy', 'intelligent automation'];
    } else if (title.includes('web') || description.includes('web development')) {
        concepts.domain = 'web development';
        concepts.challenges = ['responsive design', 'cross-browser compatibility', 'performance optimization', 'user interface design'];
        concepts.benefits = ['enhanced user experience', 'improved accessibility', 'better performance', 'modern interface'];
    } else {
        concepts.domain = 'software development';
        concepts.challenges = ['system architecture', 'performance optimization', 'user requirements', 'technical implementation'];
        concepts.benefits = ['improved efficiency', 'better user experience', 'enhanced functionality', 'reliable performance'];
    }
    
    return concepts;
}

// Generate dynamic chapter titles based on project specifics
function generateProjectSpecificChapters(projectTitle, projectDescription) {
    const concepts = extractProjectConcepts(projectTitle, projectDescription);
    
    if (concepts.domain === 'e-commerce') {
        return [
            `INTRODUCTION TO ${projectTitle.toUpperCase()} SYSTEM`,
            "E-COMMERCE PLATFORM ANALYSIS AND LITERATURE REVIEW",
            "SYSTEM ARCHITECTURE AND DESIGN METHODOLOGY",
            "FRONTEND DEVELOPMENT AND USER INTERFACE DESIGN",
            "BACKEND IMPLEMENTATION AND DATABASE INTEGRATION",
            "SECURITY, PAYMENT PROCESSING AND TESTING",
            "PERFORMANCE OPTIMIZATION AND DEPLOYMENT"
        ];
    } else if (concepts.domain === 'artificial intelligence') {
        return [
            `INTRODUCTION TO ${projectTitle.toUpperCase()}`,
            "MACHINE LEARNING ALGORITHMS AND THEORETICAL FOUNDATIONS",
            "DATA PREPROCESSING AND FEATURE ENGINEERING",
            "MODEL DEVELOPMENT AND TRAINING METHODOLOGY",
            "IMPLEMENTATION AND SYSTEM INTEGRATION",
            "PERFORMANCE EVALUATION AND VALIDATION",
            "RESULTS ANALYSIS AND FUTURE ENHANCEMENTS"
        ];
    } else if (concepts.domain === 'web development') {
        return [
            `INTRODUCTION TO ${projectTitle.toUpperCase()}`,
            "WEB TECHNOLOGIES AND FRAMEWORK ANALYSIS",
            "SYSTEM DESIGN AND ARCHITECTURE PLANNING",
            "FRONTEND DEVELOPMENT AND USER EXPERIENCE",
            "BACKEND SERVICES AND API DEVELOPMENT",
            "DATABASE DESIGN AND INTEGRATION",
            "TESTING, DEPLOYMENT AND PERFORMANCE ANALYSIS"
        ];
    } else {
        return [
            `INTRODUCTION TO ${projectTitle.toUpperCase()}`,
            "LITERATURE REVIEW AND TECHNOLOGY ANALYSIS",
            "SYSTEM DESIGN AND METHODOLOGY",
            "IMPLEMENTATION AND DEVELOPMENT PROCESS",
            "TESTING AND QUALITY ASSURANCE",
            "RESULTS AND PERFORMANCE EVALUATION"
        ];
    }
}

// Generate dynamic chapter content based on project specifics
function generateDynamicChapterContent(chapterNum, chapterTitle, config, targetWords) {
    const concepts = extractProjectConcepts(config.projectTitle, config.projectDescription);
    const projectTitle = config.projectTitle;
    const projectDescription = config.projectDescription;
    
    let content = `${chapterNum}.1 Project Overview and Introduction

The ${projectTitle} project addresses critical challenges in the ${concepts.domain} domain. ${projectDescription} This comprehensive solution leverages modern ${concepts.technologies.join(', ')} technologies to deliver a robust and scalable system.

The primary motivation for developing ${projectTitle} stems from the need to address ${concepts.challenges.join(', ')}. Current solutions in the market often lack the comprehensive approach that this project provides, making it a valuable contribution to the field.

Key features of ${projectTitle} include ${concepts.features.join(', ')}, each designed to address specific user requirements and business objectives. The system architecture ensures scalability, maintainability, and optimal performance under various operational conditions.

${chapterNum}.2 Theoretical Background and Literature Review

The theoretical foundation for ${config.projectTitle} is built upon extensive research in ${concepts.domain}. This literature review examines current approaches, methodologies, and best practices that are directly relevant to the implementation of ${config.projectTitle}.

Key research areas that inform the ${config.projectTitle} project include modern development frameworks, system architecture patterns, performance optimization techniques, and user experience design principles. The literature review reveals several important trends that have influenced the design decisions made in this project.

Existing solutions in the ${concepts.domain} domain provide valuable insights into both successful approaches and common pitfalls. This analysis has been crucial in identifying the unique value proposition of ${config.projectTitle} and the specific problems it addresses.

${chapterNum}.3 Methodology and Implementation

The development methodology for ${config.projectTitle} follows a systematic approach that ensures comprehensive coverage of all project requirements. The methodology is specifically tailored to address the unique challenges and opportunities presented by ${config.projectDescription}

The approach combines agile development principles with traditional software engineering practices to create a robust framework for delivering ${config.projectTitle}. Key phases include requirements analysis, system design, implementation, testing, and deployment.

Technical methodology includes the selection of appropriate technologies, frameworks, and tools that are best suited for implementing ${config.projectTitle}. The technology stack is chosen based on factors such as performance requirements, scalability needs, and long-term maintainability.

${chapterNum}.4 Results and Analysis

The results obtained from the implementation and testing of ${config.projectTitle} demonstrate the effectiveness of the chosen approach and validate the project's success in meeting its objectives. Performance analysis includes comprehensive testing of all major system components.

User acceptance testing results show high levels of satisfaction with ${config.projectTitle}, with users reporting improved efficiency, better user experience, and successful completion of their intended tasks.

Comparative analysis demonstrates that ${config.projectTitle} provides significant advantages over existing solutions in the ${concepts.domain} domain. These advantages include improved functionality, better performance, enhanced usability, and more robust architecture.`;

    return content;
}

// Generate comprehensive content based on word count
function generateEnhancedContent(config) {
    const chapters = generateProjectSpecificChapters(config.projectTitle, config.projectDescription);
    const concepts = extractProjectConcepts(config.projectTitle, config.projectDescription);
    const targetWords = parseInt(config.targetWordCount) || 15000;
    
    let sections = [];
    let totalChapters = chapters.length;
    
    // Adjust chapter count based on word count for proper page distribution
    if (targetWords >= 25000) {
        totalChapters = Math.min(chapters.length + 2, 9);
        if (chapters.length < 9) {
            chapters.push("ADVANCED SYSTEM FEATURES AND ENHANCEMENTS");
            chapters.push("FUTURE SCOPE AND RECOMMENDATIONS");
        }
    } else if (targetWords >= 20000) {
        totalChapters = Math.min(chapters.length + 1, 8);
        if (chapters.length < 8) {
            chapters.push("PERFORMANCE ANALYSIS AND OPTIMIZATION");
        }
    }
    
    chapters.forEach((chapter, index) => {
        const chapterNum = index + 1;
        const chapterContent = generateDynamicChapterContent(chapterNum, chapter, config, targetWords);
        
        sections.push({
            title: `CHAPTER ${chapterNum}: ${chapter}`,
            content: chapterContent,
            wordCount: chapterContent.split(' ').length
        });
    });
    
    return sections;
}

// Create formatted paragraphs with proper spacing
function createFormattedParagraphs(text) {
    const paragraphs = [];
    const lines = text.split('\n').filter(line => line.trim());

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Main heading (e.g., 1.1 Background) or Front Matter heading
        if (trimmedLine.match(/^\d+\.\d+/) || ['TRAINING CERTIFICATE', 'ACKNOWLEDGEMENT', 'ABSTRACT', 'REFERENCES', 'LIST OF CONTENTS'].includes(trimmedLine)) {
            const isFrontMatterHeading = ['TRAINING CERTIFICATE', 'ACKNOWLEDGEMENT', 'ABSTRACT', 'REFERENCES', 'LIST OF CONTENTS'].includes(trimmedLine);

            paragraphs.push(new Paragraph({
                children: [new TextRun({
                    text: trimmedLine,
                    bold: true,
                    size: 28,
                    font: "Times New Roman"
                })],
                alignment: isFrontMatterHeading ? AlignmentType.CENTER : AlignmentType.LEFT,
                spacing: {
                    before: isFrontMatterHeading ? 480 : 360,
                    after: 240,
                    line: 360,
                    lineRule: "auto"
                }
            }));
        }
        // Regular paragraph
        else {
            const isReference = trimmedLine.match(/^\d+\.\s*https?:\/\//);
            
            paragraphs.push(new Paragraph({
                children: [new TextRun({
                    text: trimmedLine,
                    bold: false,
                    size: 24,
                    font: "Times New Roman"
                })],
                alignment: isReference ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
                spacing: {
                    before: 0,
                    after: 120,
                    line: 360,
                    lineRule: "auto"
                },
                indent: isReference ? { left: 360 } : { left: 0, right: 0 }
            }));
        }
    }
    return paragraphs;
}

// Create cover page
function createCoverPage(config) {
    return [
        new Paragraph({
            children: [new TextRun({ text: config.institution.toUpperCase(), bold: true, size: 32, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 720, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({ text: config.department || `Department of ${config.course}`, bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 720 }
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
            children: [new TextRun({ text: "Submitted by:", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
        }),
        new Paragraph({
            children: [new TextRun({ text: config.studentName, bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
        }),
        new Paragraph({
            children: [new TextRun({ text: `Student ID: ${config.studentId}`, bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({ text: config.course, bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
        }),
        new Paragraph({
            children: [new TextRun({ text: config.semester, bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 720 }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Under the guidance of:", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
        }),
        new Paragraph({
            children: [new TextRun({ text: config.supervisor, bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 720 }
        }),
        new Paragraph({
            children: [new TextRun({ text: new Date().getFullYear().toString(), bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 720 }
        })
    ];
}

// Create other pages
function createCertificatePage(config) {
    return [
        new Paragraph({
            children: [new TextRun({ text: "TRAINING CERTIFICATE", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 720, after: 720 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `This is to certify that ${config.studentName} (Student ID: ${config.studentId}) has successfully completed the ${config.reportType.toLowerCase()} work on "${config.projectTitle}" as part of the curriculum for ${config.course} at ${config.institution}.`,
                bold: false, size: 24, font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 480, after: 480, line: 360, lineRule: "auto" }
        })
    ];
}

function createAcknowledgementPage(config) {
    const concepts = extractProjectConcepts(config.projectTitle, config.projectDescription);
    
    return [
        new Paragraph({
            children: [new TextRun({ text: "ACKNOWLEDGEMENT", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 720, after: 720 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `I would like to express my sincere gratitude to my supervisor, ${config.supervisor}, for his valuable guidance throughout the development of the ${config.projectTitle} project. His expertise in ${concepts.domain} has been instrumental in shaping this work.`,
                bold: false, size: 24, font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 480, after: 360, line: 360, lineRule: "auto" }
        })
    ];
}

function createAbstractPage(config) {
    const concepts = extractProjectConcepts(config.projectTitle, config.projectDescription);
    
    return [
        new Paragraph({
            children: [new TextRun({ text: "ABSTRACT", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 720, after: 720 }
        }),
        new Paragraph({
            children: [new TextRun({ 
                text: `This ${config.reportType} presents the comprehensive development and implementation of "${config.projectTitle}", a ${concepts.domain} solution that leverages ${concepts.technologies.join(' and ')} technologies. ${config.projectDescription}`, 
                bold: false, size: 24, font: "Times New Roman" 
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 480, after: 360, line: 360, lineRule: "auto" }
        })
    ];
}

// Create header and footer
function createHeader(config) {
    return new Header({
        children: [new Paragraph({
            children: [new TextRun({ 
                text: config.projectTitle, 
                size: 20, 
                font: "Times New Roman",
                bold: false
            })],
            alignment: AlignmentType.LEFT,
            spacing: { before: 240, after: 240 }
        })]
    });
}

function createFooter() {
    return new Footer({
        children: [new Paragraph({
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.RIGHT
        })]
    });
}

// Dynamic DOCX creation
async function createDynamicDocx(config) {
    try {
        const sections = generateEnhancedContent(config);
        const mainBodyContent = [];

        sections.forEach((section, index) => {
            if (index > 0) {
                mainBodyContent.push(new Paragraph({ 
                    children: [new PageBreak()],
                    spacing: { before: 0, after: 0 }
                }));
            }
            
            mainBodyContent.push(new Paragraph({
                children: [new TextRun({ text: section.title, bold: true, size: 28, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 720, after: 480 }
            }));
            
            const contentParagraphs = createFormattedParagraphs(section.content);
            mainBodyContent.push(...contentParagraphs);
        });

        // Add references
        mainBodyContent.push(new Paragraph({ children: [new PageBreak()] }));
        mainBodyContent.push(new Paragraph({
            children: [new TextRun({ text: "REFERENCES", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 240 }
        }));

        const concepts = extractProjectConcepts(config.projectTitle, config.projectDescription);
        const references = [
            `1. ${concepts.technologies[0] || 'Technology'} Official Documentation`,
            `2. ${concepts.domain.charAt(0).toUpperCase() + concepts.domain.slice(1)} Best Practices`,
            `3. Research Papers on ${concepts.features[0] || 'System Development'}`,
            `4. Performance Analysis Studies`,
            `5. Industry Standards and Guidelines`
        ];
        
        const referenceParagraphs = createFormattedParagraphs(references.join('\n'));
        mainBodyContent.push(...referenceParagraphs);

        const doc = new Document({
            sections: [
                // Cover Page
                {
                    children: createCoverPage(config),
                    headers: { default: new Header({ children: [new Paragraph("")] }) },
                    footers: { default: new Footer({ children: [new Paragraph("")] }) },
                    properties: {
                        page: { 
                            pageNumbers: { start: 1, formatType: NumberFormat.NONE },
                            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
                        }
                    }
                },
                // Front Matter
                {
                    headers: { default: createHeader(config) },
                    footers: { default: createFooter() },
                    children: [
                        ...createCertificatePage(config),
                        new Paragraph({ children: [new PageBreak()] }),
                        ...createAcknowledgementPage(config),
                        new Paragraph({ children: [new PageBreak()] }),
                        ...createAbstractPage(config)
                    ],
                    properties: {
                        page: {
                            pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN },
                            margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
                        }
                    }
                },
                // Main Body
                {
                    headers: { default: createHeader(config) },
                    footers: { default: createFooter() },
                    children: mainBodyContent,
                    properties: {
                        page: {
                            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
                            margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
                        }
                    }
                }
            ],
            styles: {
                default: {
                    document: {
                        run: { size: 24, font: "Times New Roman" },
                        paragraph: { spacing: { line: 360 } }
                    }
                }
            }
        });

        return await Packer.toBuffer(doc);
    } catch (error) {
        console.error('Dynamic DOCX generation error:', error);
        throw error;
    }
}

// Main serverless function handler
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { method, url } = req;
    
    try {
        // Health check
        if (method === 'GET' && url === '/api/health') {
            return res.json({ status: 'OK', message: 'Dynamic AI Report Generator is running!' });
        }
        
        // Progress check
        if (method === 'GET' && url.startsWith('/api/progress/')) {
            const sessionId = url.split('/').pop();
            const progress = progressTracking.get(sessionId) || { progress: 0, status: 'Starting...' };
            return res.json(progress);
        }
        
        // Download report
        if (method === 'GET' && url.startsWith('/api/download/')) {
            const sessionId = url.split('/').pop();
            const progressData = progressTracking.get(sessionId);
            
            if (!progressData || !progressData.reportData) {
                return res.status(404).json({ error: 'Report not found or not ready' });
            }
            
            const { content, filename } = progressData.reportData;
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            
            return res.send(content);
        }
        
        // Generate report
        if (method === 'POST' && url === '/api/generate-report') {
            const sessionId = Date.now().toString();
            const config = req.body;
            
            // Validate required fields
            const required = ['studentName', 'studentId', 'course', 'semester', 'institution', 'supervisor', 'projectTitle', 'projectDescription', 'reportType', 'targetWordCount'];
            
            for (const field of required) {
                if (!config[field] || config[field].trim() === '') {
                    return res.status(400).json({ error: `Missing required field: ${field}` });
                }
            }
            
            if (!config.department) {
                config.department = `Department of ${config.course}`;
            }
            
            // Start generation process
            progressTracking.set(sessionId, { progress: 10, status: 'Analyzing project requirements...' });
            
            // Generate report asynchronously
            setImmediate(async () => {
                try {
                    progressTracking.set(sessionId, { progress: 30, status: 'Generating dynamic content...' });
                    
                    const concepts = extractProjectConcepts(config.projectTitle, config.projectDescription);
                    
                    progressTracking.set(sessionId, { progress: 70, status: 'Creating DOCX format...' });
                    
                    const docxBuffer = await createDynamicDocx(config);
                    
                    const filename = `${config.studentName.replace(/\s+/g, '_')}_${config.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Dynamic_${config.targetWordCount}w_Report.docx`;
                    
                    const reportData = {
                        content: docxBuffer,
                        filename: filename,
                        completed: true,
                        completedAt: new Date().toISOString(),
                        isDocx: true,
                        isDynamic: true,
                        wordCount: config.targetWordCount,
                        projectConcepts: concepts
                    };
                    
                    progressTracking.set(sessionId, {
                        progress: 100,
                        status: `Dynamic ${config.targetWordCount}-word report completed!`,
                        reportData: reportData
                    });
                    
                } catch (error) {
                    console.error('Report generation failed:', error);
                    progressTracking.set(sessionId, {
                        progress: 0,
                        status: `Generation failed: ${error.message}`,
                        error: true
                    });
                }
            });
            
            return res.json({ sessionId, message: 'Dynamic report generation started' });
        }
        
        // Default response
        return res.status(404).json({ error: 'Endpoint not found' });
        
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
};