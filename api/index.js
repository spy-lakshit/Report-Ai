// Dynamic AI Report Generator API - Vercel Ready with Dynamic Content
const express = require('express');
const cors = require('cors');
const { Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, Header, Footer, PageNumber, NumberFormat, TabStopType, LeaderType } = require('docx');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const progressTracking = new Map();

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Enhanced AI Report Generator is running!' });
});

// Progress endpoint
app.get('/api/progress/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const progress = progressTracking.get(sessionId) || { progress: 0, status: 'Starting...' };
    res.json(progress);
});

// Update progress helper
function updateProgress(sessionId, progress, status) {
    progressTracking.set(sessionId, { progress, status, timestamp: new Date().toISOString() });
    console.log(`📊 Progress [${sessionId}]: ${progress}% - ${status}`);
}

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

// Generate comprehensive content based on word count
function generateEnhancedContent(config) {
    const chapters = generateProjectSpecificChapters(config.projectTitle, config.projectDescription);
    const concepts = extractProjectConcepts(config.projectTitle, config.projectDescription);
    const targetWords = parseInt(config.targetWordCount) || 15000;
    
    console.log(`🎯 Generating DYNAMIC content for: ${config.projectTitle}`);
    console.log(`🔍 Detected domain: ${concepts.domain}`);
    console.log(`⚙️ Technologies: ${concepts.technologies.join(', ')}`);
    console.log(`🚀 Features: ${concepts.features.join(', ')}`);
    
    let sections = [];
    let contentMultiplier = 1;
    let totalChapters = 6;
    
    if (targetWords >= 25000) {
        contentMultiplier = 3.5;
        totalChapters = 9;
        chapters.push("ADVANCED FEATURES AND SYSTEM ENHANCEMENTS");
        chapters.push("COMPARATIVE ANALYSIS AND BENCHMARKING STUDIES");
        chapters.push("FUTURE SCOPE, RECOMMENDATIONS AND CONCLUSIONS");
    } else if (targetWords >= 20000) {
        contentMultiplier = 2.5;
        totalChapters = 8;
        chapters.push("ADVANCED IMPLEMENTATION AND OPTIMIZATION");
        chapters.push("PERFORMANCE ANALYSIS AND SYSTEM EVALUATION");
    } else {
        contentMultiplier = 1.8;
        totalChapters = 7;
        chapters.push("PERFORMANCE EVALUATION AND OPTIMIZATION");
    }
    
    console.log(`📊 Generating ${totalChapters} chapters with ${targetWords} words target`);
    
    chapters.forEach((chapter, index) => {
        const chapterNum = index + 1;
        const chapterContent = generateChapterContent(chapterNum, chapter, config, contentMultiplier);
        
        sections.push({
            title: `CHAPTER ${chapterNum}: ${chapter}`,
            content: chapterContent,
            wordCount: chapterContent.split(' ').length
        });
    });
    
    return sections;
}

// Generate dynamic chapter content based on project specifics
function generateChapterContent(chapterNum, chapterTitle, config, multiplier) {
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

${chapterNum}.3 Methodology and Approach

The methodology employed in this chapter follows a systematic and structured approach that ensures comprehensive coverage of all relevant aspects. The approach is designed to be both thorough and practical, providing actionable insights and solutions.

The methodology incorporates both quantitative and qualitative analysis techniques to ensure a balanced and comprehensive evaluation of all aspects.

${chapterNum}.4 Implementation Details and Technical Specifications

The implementation of the concepts and methodologies described in this chapter involves detailed technical specifications and careful consideration of all system requirements. The implementation approach is designed to be modular, scalable, and maintainable.

Technical specifications include detailed descriptions of all system components, interfaces, data structures, and algorithms.

${chapterNum}.5 Results and Analysis

The results obtained from the implementation and testing of the concepts described in this chapter demonstrate the effectiveness of the proposed approach. Comprehensive analysis of these results provides insights into both the strengths and areas for improvement.

Performance metrics collected during testing and validation demonstrate that the implemented solution meets or exceeds all specified requirements.`;

    // Add substantial additional content for higher word counts
    if (multiplier > 1.5) {
        content += `\n\n${chapterNum}.6 Advanced Features and Capabilities

Advanced features implemented as part of this work extend the basic functionality to support complex use cases and specialized requirements. These features are designed to be modular and extensible, allowing for future enhancements and customizations.

The advanced features include sophisticated algorithms, intelligent automation capabilities, advanced user interface components, and comprehensive integration capabilities.

${chapterNum}.7 Integration and Interoperability

Integration capabilities enable the system to work seamlessly with existing infrastructure and third-party systems. Comprehensive API documentation and integration guidelines support both internal and external integration requirements.

Interoperability standards compliance ensures that the system can communicate effectively with a wide range of external systems and services.

${chapterNum}.8 Quality Assurance and Validation

Comprehensive quality assurance processes ensure that all aspects of the implementation meet the highest standards for reliability, performance, and usability. These processes include both automated and manual testing procedures.

Validation procedures verify that the implemented solution meets all specified requirements and performs as expected under various operating conditions.`;
    }
    
    if (multiplier > 2.5) {
        content += `\n\n${chapterNum}.9 Security and Compliance Framework

Security considerations are integrated into all aspects of the system design and implementation. Comprehensive security measures protect against various types of threats and vulnerabilities while maintaining system usability and performance.

The security framework includes authentication mechanisms, authorization controls, data encryption, secure communication protocols, and comprehensive audit logging.

${chapterNum}.10 Performance Optimization and Scalability

Performance optimization techniques are applied throughout the system to ensure optimal performance under various load conditions. These techniques include algorithm optimization, database optimization, caching strategies, and resource management.

Scalability considerations are integrated into the system architecture to support future growth and increased usage.

${chapterNum}.11 Maintenance and Support Infrastructure

Comprehensive maintenance procedures and documentation ensure long-term system reliability and availability. These procedures include preventive maintenance, corrective maintenance, and adaptive maintenance to address changing requirements.

Support infrastructure includes help desk capabilities, user documentation, training materials, and troubleshooting guides.

${chapterNum}.12 Future Enhancements and Roadmap

Future enhancement opportunities have been identified through user feedback, performance analysis, and technology trend analysis. These enhancements are prioritized based on user value, technical feasibility, and resource requirements.

The development roadmap includes both short-term and long-term enhancement plans.`;
    }
    
    return content;
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

// Create detailed Table of Contents with proper spacing
function createTableOfContentsPage(config) {
    const chapters = generateProjectSpecificChapters(config.projectTitle, config.projectDescription);
    const targetWords = parseInt(config.targetWordCount) || 15000;
    
    const contents = [
        new Paragraph({
            children: [new TextRun({ text: "TABLE OF CONTENTS", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 480 }
        })
    ];

    const tabStops = [{
        type: TabStopType.RIGHT,
        position: 9000,
        leader: LeaderType.DOT
    }];

    // Front matter
    const tocItems = [
        { text: "Training Certificate", page: "i", bold: false, indent: 0 },
        { text: "Acknowledgement", page: "ii", bold: false, indent: 0 },
        { text: "Abstract", page: "iii", bold: false, indent: 0 },
        { text: "Table of Contents", page: "iv-v", bold: false, indent: 0 },
        { text: "List of Tables", page: "vi", bold: false, indent: 0 },
        { text: "List of Figures", page: "vii", bold: false, indent: 0 }
    ];

    // Dynamic chapters with detailed subsections - improved page calculation
    let pageStart = 1;
    const pagesPerChapter = targetWords >= 25000 ? 14 : targetWords >= 20000 ? 12 : targetWords >= 15000 ? 10 : 8;
    
    chapters.forEach((chapter, index) => {
        const chapterNum = index + 1;
        const pageEnd = pageStart + pagesPerChapter - 1;
        
        // Main chapter heading
        tocItems.push({
            text: `Chapter ${chapterNum}: ${chapter}`,
            page: `${pageStart}-${pageEnd}`,
            bold: true,
            indent: 0
        });
        
        // Chapter subsections with specific page numbers
        const subsections = [
            "Overview and Introduction",
            "Theoretical Background and Literature Review", 
            "Methodology and Approach",
            "Implementation Details and Technical Specifications",
            "Results and Analysis"
        ];
        
        if (targetWords >= 15000) {
            subsections.push("Advanced Features and Capabilities");
            subsections.push("Integration and Interoperability");
            subsections.push("Quality Assurance and Validation");
        }
        
        if (targetWords >= 20000) {
            subsections.push("Security and Compliance Framework");
            subsections.push("Performance Optimization and Scalability");
        }
        
        if (targetWords >= 25000) {
            subsections.push("Maintenance and Support Infrastructure");
            subsections.push("Future Enhancements and Roadmap");
        }
        
        const pagesPerSubsection = Math.floor(pagesPerChapter / subsections.length);
        let subPageStart = pageStart;
        
        subsections.forEach((subsection, subIndex) => {
            const subPageEnd = Math.min(subPageStart + pagesPerSubsection - 1, pageEnd);
            tocItems.push({
                text: `${chapterNum}.${subIndex + 1} ${subsection}`,
                page: subPageStart.toString(),
                bold: false,
                indent: 360
            });
            subPageStart = subPageEnd + 1;
        });
        
        pageStart = pageEnd + 1;
    });

    // References
    tocItems.push({
        text: "References",
        page: pageStart.toString(),
        bold: true,
        indent: 0
    });

    // Render TOC items with proper spacing
    for (const item of tocItems) {
        contents.push(
            new Paragraph({
                children: [
                    new TextRun({ text: item.text, bold: item.bold, size: 24, font: "Times New Roman" }),
                    new TextRun({ text: '\t', size: 24, font: "Times New Roman" }),
                    new TextRun({ text: item.page, bold: item.bold, size: 24, font: "Times New Roman" })
                ],
                alignment: AlignmentType.LEFT,
                spacing: { before: 0, after: 60, line: 240, lineRule: "auto" }, // Reduced spacing
                indent: { left: item.indent },
                tabStops: tabStops
            })
        );
    }

    return contents;
}

// Create other pages (Certificate, Acknowledgement, Abstract, etc.)
function createCertificatePage(config) {
    return [
        new Paragraph({
            children: [new TextRun({ text: "TRAINING CERTIFICATE", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `This is to certify that ${config.studentName} (Student ID: ${config.studentId}) has successfully completed the ${config.reportType.toLowerCase()} work on "${config.projectTitle}" as part of the curriculum for ${config.course} at ${config.institution}.`,
                bold: false, size: 24, font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 360, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `The work was carried out under the supervision of ${config.supervisor} during the academic year ${new Date().getFullYear()}.`,
                bold: false, size: 24, font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 720, line: 360, lineRule: "auto" }
        })
    ];
}

function createAcknowledgementPage(config) {
    return [
        new Paragraph({
            children: [new TextRun({ text: "ACKNOWLEDGEMENT", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `I would like to express my sincere gratitude to my supervisor, ${config.supervisor}, for his valuable guidance, continuous support, and encouragement throughout the development of this ${config.reportType.toLowerCase()}.`,
                bold: false, size: 24, font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 360, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `I am also thankful to the faculty members of ${config.department}, ${config.institution}, for their support and for providing the necessary resources and facilities required for this work.`,
                bold: false, size: 24, font: "Times New Roman"
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 720, line: 360, lineRule: "auto" }
        })
    ];
}

function createAbstractPage(config) {
    return [
        new Paragraph({
            children: [new TextRun({ text: "ABSTRACT", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({ 
                text: `This ${config.reportType} presents the comprehensive study and implementation of "${config.projectTitle}". ${config.projectDescription}`, 
                bold: false, size: 24, font: "Times New Roman" 
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 360, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ 
                text: "The methodology involves systematic analysis, design, implementation, and evaluation. The work demonstrates practical application of modern technologies and methodologies.", 
                bold: false, size: 24, font: "Times New Roman" 
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 720, line: 360, lineRule: "auto" }
        })
    ];
}

// Create footer
function createFooter() {
    return new Footer({
        children: [new Paragraph({
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.RIGHT
        })]
    });
}

// Enhanced DOCX creation
async function createEnhancedDocx(config) {
    try {
        console.log(`📝 Creating enhanced DOCX with ${config.targetWordCount} words target...`);
        
        const sections = generateEnhancedContent(config);
        const mainBodyContent = [];

        sections.forEach((section, index) => {
            if (index > 0) {
                mainBodyContent.push(new Paragraph({ children: [new PageBreak()] }));
            }
            
            mainBodyContent.push(new Paragraph({
                children: [new TextRun({ text: section.title, bold: true, size: 28, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 480, after: 240 }
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

        const references = [
            "1. https://docs.oracle.com/javase/ - Official Java documentation",
            "2. https://reactjs.org/ - React JavaScript library documentation", 
            "3. https://nodejs.org/ - Node.js runtime environment",
            "4. https://developer.mozilla.org/ - Web development resources",
            "5. https://www.python.org/ - Python programming language"
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
                    headers: { default: new Header({ children: [new Paragraph("")] }) },
                    footers: { default: createFooter() },
                    children: [
                        ...createCertificatePage(config),
                        new Paragraph({ children: [new PageBreak()] }),
                        ...createAcknowledgementPage(config),
                        new Paragraph({ children: [new PageBreak()] }),
                        ...createAbstractPage(config),
                        new Paragraph({ children: [new PageBreak()] }),
                        ...createTableOfContentsPage(config)
                    ],
                    properties: {
                        page: {
                            pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN },
                            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
                        }
                    }
                },
                // Main Body
                {
                    headers: { default: new Header({ children: [new Paragraph("")] }) },
                    footers: { default: createFooter() },
                    children: mainBodyContent,
                    properties: {
                        page: {
                            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
                            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
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
        console.error('Enhanced DOCX generation error:', error);
        throw error;
    }
}

// Report generation endpoint
app.post('/api/generate-report', async (req, res) => {
    const sessionId = Date.now().toString();
    
    try {
        const config = req.body;
        
        const required = ['studentName', 'studentId', 'course', 'semester', 'institution', 'supervisor', 'projectTitle', 'projectDescription', 'reportType', 'targetWordCount'];
        
        for (const field of required) {
            if (!config[field] || config[field].trim() === '') {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }
        
        if (!config.department) {
            config.department = `Department of ${config.course}`;
        }
        
        res.json({ sessionId, message: 'Enhanced report generation started' });
        
        console.log(`🎯 Generating enhanced report: ${config.projectTitle} (${config.targetWordCount} words)`);
        
        updateProgress(sessionId, 10, 'Initializing enhanced system...');
        
        (async () => {
            try {
                updateProgress(sessionId, 30, 'Generating dynamic chapters...');
                updateProgress(sessionId, 70, 'Creating enhanced DOCX format...');
                
                const docxBuffer = await createEnhancedDocx(config);
                
                updateProgress(sessionId, 90, 'Finalizing enhanced report...');
                
                const filename = `${config.studentName.replace(/\s+/g, '_')}_${config.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Enhanced_${config.targetWordCount}w_Report.docx`;
                
                const reportData = {
                    content: docxBuffer,
                    filename: filename,
                    completed: true,
                    completedAt: new Date().toISOString(),
                    isDocx: true,
                    isEnhanced: true,
                    wordCount: config.targetWordCount
                };
                
                progressTracking.set(sessionId, {
                    progress: 100,
                    status: `Enhanced ${config.targetWordCount}-word report completed!`,
                    timeRemaining: 0,
                    reportData: reportData
                });
                
                console.log(`✅ Enhanced report generated: ${filename}`);
                
            } catch (error) {
                console.error('❌ Enhanced report generation failed:', error);
                progressTracking.set(sessionId, {
                    progress: 0,
                    status: `Generation failed: ${error.message}`,
                    timeRemaining: 0,
                    error: true
                });
            }
        })();
        
    } catch (error) {
        console.error('❌ Enhanced report generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Download endpoint
app.get('/api/download/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const progressData = progressTracking.get(sessionId);
    
    if (!progressData || !progressData.reportData) {
        return res.status(404).json({ error: 'Enhanced report not found or not ready' });
    }
    
    const { content, filename } = progressData.reportData;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Report-Type', 'enhanced-docx');
    
    res.send(content);
});

// Start server
if (require.main === module) {
    const PORT = process.env.PORT || 3004;
    app.listen(PORT, () => {
        console.log(`🚀 Enhanced AI Report Generator API running on http://localhost:${PORT}`);
        console.log(`✨ Features: Dynamic chapters, Multiple word counts (15k/20k/25k), Smart page counts (50-100 pages)`);
    });
}

module.exports = app;