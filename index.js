// AI Report Generator Server - Vercel Deployment
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, Header, Footer, PageNumber, NumberFormat, TabStopType, LeaderType } = require('docx');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Serve the stunning HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Report generation endpoint
app.post('/api/generate-report', async (req, res) => {
    const sessionId = Date.now().toString();
    
    try {
        const config = req.body;
        
        // Use built-in API key
        const BUILT_IN_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA61ci1A96CnXeFnrxtp7QwG-hSl8ypS4Y';
        config.apiKey = BUILT_IN_API_KEY;
        
        // Validate required fields
        const required = ['studentName', 'studentId', 'course', 'semester', 'institution', 'supervisor', 'projectTitle', 'projectDescription', 'reportType'];
        
        for (const field of required) {
            if (!config[field] || config[field].trim() === '') {
                return res.status(400).json({
                    error: `Missing required field: ${field}`
                });
            }
        }
        
        // Return session ID immediately for progress tracking
        res.json({ sessionId, message: 'Report generation started' });
        
        console.log(`🎯 Generating report for: ${config.projectTitle}`);
        
        // Start progress tracking
        updateProgress(sessionId, 5, 'Initializing AI system...', 300);
        
        // Generate the report with progress tracking
        const reportBuffer = await generateUniversityReportWithProgress(config, sessionId);
        
        // Create filename
        const filename = `${config.studentName.replace(/\s+/g, '_')}_${config.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Report.docx`;
        
        // Store the completed report for download
        const reportData = {
            buffer: reportBuffer,
            filename: filename,
            completed: true,
            completedAt: new Date().toISOString()
        };
        
        progressTracking.set(sessionId, {
            progress: 100,
            status: 'Report completed! Ready for download.',
            timeRemaining: 0,
            reportData: reportData
        });
        
    } catch (error) {
        console.error('❌ Report generation error:', error);
        updateProgress(sessionId, 0, `Error: ${error.message}`, 0);
    }
});

// Download endpoint for completed reports
app.get('/api/download/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const progressData = progressTracking.get(sessionId);
    
    if (!progressData || !progressData.reportData) {
        return res.status(404).json({ error: 'Report not found or not ready' });
    }
    
    const { buffer, filename } = progressData.reportData;
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    
    // Send the file
    res.send(buffer);
    
    // Clean up after download
    setTimeout(() => {
        progressTracking.delete(sessionId);
    }, 60000);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Progress tracking for report generation
const progressTracking = new Map();

app.get('/api/progress/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const progress = progressTracking.get(sessionId) || { progress: 0, status: 'Starting...', timeRemaining: 300 };
    res.json(progress);
});

// Update progress helper function
function updateProgress(sessionId, progress, status, timeRemaining = null) {
    const progressData = { progress, status, timestamp: new Date().toISOString() };
    if (timeRemaining !== null) {
        progressData.timeRemaining = timeRemaining;
    }
    progressTracking.set(sessionId, progressData);
    console.log(`📊 Progress [${sessionId}]: ${progress}% - ${status}`);
}

// Function to call Gemini API
async function generateContent(prompt, apiKey, retries = 3) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000,
            topP: 0.8,
            topK: 40
        }
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('No content generated by Gemini API');
            }

            const candidate = data.candidates[0];
            const content = candidate.content?.parts?.[0]?.text || '';

            if (!content.trim()) {
                throw new Error('Empty content generated');
            }

            return {
                content: content.trim(),
                wordCount: content.trim().split(/\s+/).length,
                finishReason: candidate.finishReason
            };

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);

            if (attempt === retries) {
                return {
                    content: `[Error generating content for this section. Please check your API key and try again.]`,
                    wordCount: 20,
                    finishReason: 'error'
                };
            }

            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
}

// Function to create report sections - OPTIMIZED FOR 50 PAGES
function createReportSections(config) {
    return [
        {
            type: 'introduction',
            title: 'CHAPTER 1: INTRODUCTION',
            wordTarget: 1500,
            prompt: `Generate a concise Introduction chapter for a ${config.reportType} report titled "${config.projectTitle}".
Project Description: ${config.projectDescription}
Structure the introduction with these subsections: 1.1 Background and Motivation (400 words), 1.2 Problem Statement (300 words), 1.3 Objectives (400 words), 1.4 Scope and Limitations (250 words), 1.5 Report Organization (150 words). Write in formal academic language with proper subsection headings. Use continuous paragraphs under each subsection. DO NOT include any chapter title in the content - only generate the subsection content.`
        },
        {
            type: 'literature-review',
            title: 'CHAPTER 2: LITERATURE REVIEW',
            wordTarget: 1600,
            prompt: `Generate a focused Literature Review chapter for "${config.projectTitle}".
Project Description: ${config.projectDescription}
Structure with these subsections: 2.1 Theoretical Background (450 words), 2.2 Technology Review (400 words), 2.3 Related Work and Existing Solutions (450 words), 2.4 Research Gap and Justification (300 words). Include academic-style references and citations. Write in formal language with proper subsections. DO NOT include any chapter title in the content - only generate the subsection content.`
        },
        {
            type: 'methodology',
            title: 'CHAPTER 3: METHODOLOGY',
            wordTarget: 1700,
            prompt: `Generate a focused Methodology chapter for "${config.projectTitle}".
Project Description: ${config.projectDescription}
Structure with these subsections: 3.1 Development Approach (400 words), 3.2 System Requirements (450 words), 3.3 System Design and Architecture (500 words), 3.4 Technology Stack and Tools (350 words). Write with technical depth appropriate for the technologies mentioned in the project description. DO NOT include any chapter title in the content - only generate the subsection content.`
        },
        {
            type: 'system-analysis',
            title: 'CHAPTER 4: SYSTEM ANALYSIS AND DESIGN',
            wordTarget: 1700,
            prompt: `Generate a focused System Analysis and Design chapter for "${config.projectTitle}".
Project Description: ${config.projectDescription}
Structure with these subsections: 4.1 Requirements Analysis (450 words), 4.2 System Architecture (500 words), 4.3 Database Design (400 words), 4.4 User Interface Design (350 words). Include technical diagrams descriptions and design rationale. DO NOT include any chapter title in the content - only generate the subsection content.`
        },
        {
            type: 'implementation',
            title: 'CHAPTER 5: IMPLEMENTATION',
            wordTarget: 1800,
            prompt: `Generate a focused Implementation chapter for "${config.projectTitle}".
Project Description: ${config.projectDescription}
Structure with these subsections: 5.1 Development Environment Setup (350 words), 5.2 Database Implementation (450 words), 5.3 Core System Development (600 words), 5.4 User Interface Development (400 words). Include code examples and technical implementation details relevant to the project. DO NOT include any chapter title in the content - only generate the subsection content.`
        },
        {
            type: 'testing',
            title: 'CHAPTER 6: TESTING AND VALIDATION',
            wordTarget: 1400,
            prompt: `Generate a focused Testing and Validation chapter for "${config.projectTitle}".
Project Description: ${config.projectDescription}
Structure with these subsections: 6.1 Testing Strategy (350 words), 6.2 Unit and Integration Testing (350 words), 6.3 System and Performance Testing (350 words), 6.4 User Acceptance Testing (350 words). Include specific testing approaches and results relevant to the project. DO NOT include any chapter title in the content - only generate the subsection content.`
        },
        {
            type: 'conclusion',
            title: 'CHAPTER 7: CONCLUSION',
            wordTarget: 1000,
            prompt: `Generate a concise Conclusion chapter for "${config.projectTitle}".
Project Description: ${config.projectDescription}
Structure with these subsections: 7.1 Summary of Achievements (300 words), 7.2 Key Findings and Insights (250 words), 7.3 Limitations and Challenges (250 words), 7.4 Future Work and Recommendations (200 words). Provide a thoughtful conclusion. DO NOT include any chapter title in the content - only generate the subsection content.`
        },
        {
            type: 'references',
            title: 'REFERENCES',
            wordTarget: 150,
            prompt: `Generate a simple References section for "${config.projectTitle}".
Create 10-12 relevant website URLs related to the project topic. Format as simple numbered list with just website URLs and brief descriptions. Example format:
1. https://docs.oracle.com/javase/ - Official Java documentation
2. https://www.mysql.com/ - MySQL database official website

Generate ONLY website URLs with brief descriptions. Do NOT include academic citations, research papers, or journal references. Keep it simple with just website links. Generate ONLY the numbered website references, each on a new line.`
        }
    ];
}

// Enhanced report generation function with progress tracking
async function generateUniversityReportWithProgress(config, sessionId) {
    console.log(`📄 Starting report generation for: ${config.projectTitle}`);
    
    const sectionsConfig = createReportSections(config);
    const mainBodyContent = [];
    let totalWordCount = 0;
    const totalSections = sectionsConfig.length;

    updateProgress(sessionId, 10, 'Setting up report structure...', 280);
    await sleep(1000);

    // Generate content for each section
    for (let i = 0; i < sectionsConfig.length; i++) {
        const section = sectionsConfig[i];
        const progressPercent = 15 + Math.floor((i / totalSections) * 70);
        const timeRemaining = Math.max(10, (totalSections - i) * 35);
        
        updateProgress(sessionId, progressPercent, `Generating ${section.title}...`, timeRemaining);
        console.log(`⏳ Generating ${section.title} (Target: ${section.wordTarget} words)...`);
        
        const result = await generateContent(section.prompt, config.apiKey);
        
        // Add page break before each chapter (except the first one)
        if (i > 0) {
            mainBodyContent.push(new Paragraph({ children: [new PageBreak()] }));
        }

        // Chapter Title Paragraph
        mainBodyContent.push(
            new Paragraph({
                children: [new TextRun({ text: section.title, bold: true, size: 28, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 480, after: 240 },
            })
        );
        
        // Process content paragraphs
        const contentParagraphs = createFormattedParagraphs(result.content);
        mainBodyContent.push(...contentParagraphs);

        totalWordCount += result.wordCount;
        console.log(`✅ Generated ${section.title} (Word Count: ${result.wordCount})`);
    }

    updateProgress(sessionId, 85, 'Formatting document structure...', 30);
    await sleep(2000);

    // Create the document with proper structure
    const doc = new Document({
        sections: [
            // Cover Page
            {
                children: createCoverPage(config),
                headers: { default: new Header({ children: [new Paragraph("")] }) },
                footers: { default: new Footer({ children: [new Paragraph("")] }) },
                properties: {
                    page: { 
                        pageNumbers: { 
                            start: 1, 
                            formatType: NumberFormat.NONE 
                        } 
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
                    ...createTableOfContentsPage(config),
                ],
                properties: {
                    page: {
                        pageNumbers: {
                            start: 1,
                            formatType: NumberFormat.LOWER_ROMAN,
                        },
                    },
                },
            },
            // Main Body
            {
                headers: { default: new Header({ children: [new Paragraph("")] }) },
                footers: { default: createFooter() },
                children: mainBodyContent,
                properties: {
                    page: {
                        pageNumbers: {
                            start: 1,
                            formatType: NumberFormat.DECIMAL,
                        },
                    },
                },
            },
        ],
        styles: {
            default: {
                document: {
                    run: {
                        size: 24,
                        font: "Times New Roman",
                    },
                    paragraph: {
                        spacing: {
                            line: 360,
                        },
                    },
                },
            },
        },
    });

    updateProgress(sessionId, 90, 'Creating DOCX file...', 15);
    await sleep(1000);

    console.log(`📊 Total Word Count: ${totalWordCount}`);
    
    updateProgress(sessionId, 95, 'Finalizing document...', 5);
    
    // Generate and return the buffer
    const buffer = await Packer.toBuffer(doc);
    
    updateProgress(sessionId, 100, 'Report completed successfully!', 0);
    
    return buffer;
}

// Helper function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to create formatted paragraphs
function createFormattedParagraphs(text) {
    const paragraphs = [];
    const lines = text.split('\n').filter(line => line.trim());

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Skip chapter headings
        if (trimmedLine.match(/^#+\s*Chapter \d+:/i) || trimmedLine.match(/^Chapter \d+:/i)) {
            continue;
        }

        // Main heading or regular paragraph
        if (trimmedLine.match(/^\d+\.\d+/) || ['TRAINING CERTIFICATE', 'ACKNOWLEDGEMENT', 'ABSTRACT', 'REFERENCES'].includes(trimmedLine)) {
            const isFrontMatter = ['TRAINING CERTIFICATE', 'ACKNOWLEDGEMENT', 'ABSTRACT', 'REFERENCES'].includes(trimmedLine);
            paragraphs.push(
                new Paragraph({
                    children: [new TextRun({ text: trimmedLine, bold: true, size: 28, font: "Times New Roman" })],
                    alignment: isFrontMatter ? AlignmentType.CENTER : AlignmentType.LEFT,
                    spacing: { before: isFrontMatter ? 480 : 360, after: 240, line: 360, lineRule: "auto" }
                })
            );
        } else {
            const isReference = trimmedLine.match(/^\d+\.\s*https?:\/\//);
            paragraphs.push(
                new Paragraph({
                    children: [new TextRun({ text: trimmedLine, bold: false, size: 24, font: "Times New Roman" })],
                    alignment: isReference ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
                    spacing: { before: 0, after: 120, line: 360, lineRule: "auto" },
                    indent: isReference ? { left: 360 } : { left: 0, right: 0 }
                })
            );
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
            children: [new TextRun({ text: `A ${config.reportType.toUpperCase()} REPORT`, bold: true, size: 28, font: "Times New Roman" })],
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

// Create certificate page
function createCertificatePage(config) {
    return [
        new Paragraph({
            children: [new TextRun({ text: "TRAINING CERTIFICATE", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({ text: `This is to certify that ${config.studentName} (Student ID: ${config.studentId}) has successfully completed the ${config.reportType} work on "${config.projectTitle}" as part of the curriculum for ${config.course} at ${config.institution}.`, bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 360, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ text: `The work was carried out under the supervision of ${config.supervisor} during the academic year ${new Date().getFullYear()}.`, bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 720, line: 360, lineRule: "auto" }
        })
    ];
}

// Create acknowledgement page
function createAcknowledgementPage(config) {
    return [
        new Paragraph({
            children: [new TextRun({ text: "ACKNOWLEDGEMENT", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({ text: `I would like to express my sincere gratitude to my supervisor, ${config.supervisor}, for his valuable guidance, continuous support, and encouragement throughout this work.`, bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 360, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ text: `I am also thankful to the faculty members of ${config.department || 'the department'}, ${config.institution}, for their support and for providing the necessary resources and facilities required for this work.`, bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 360, line: 360, lineRule: "auto" }
        })
    ];
}

// Create abstract page
function createAbstractPage(config) {
    return [
        new Paragraph({
            children: [new TextRun({ text: "ABSTRACT", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({ text: `This ${config.reportType} presents the comprehensive study and development of "${config.projectTitle}". ${config.projectDescription.substring(0, 200)}...`, bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 360, after: 360, line: 360, lineRule: "auto" }
        })
    ];
}

// Create table of contents
function createTableOfContentsPage(config) {
    return [
        new Paragraph({
            children: [new TextRun({ text: "TABLE OF CONTENTS", bold: true, size: 28, font: "Times New Roman" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Chapter 1: Introduction ........................... 1-7", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 120, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Chapter 2: Literature Review .................... 8-15", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 120, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Chapter 3: Methodology ......................... 16-23", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 120, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Chapter 4: System Analysis and Design .......... 24-31", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 120, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Chapter 5: Implementation ...................... 32-39", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 120, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Chapter 6: Testing and Validation .............. 40-46", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 120, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ text: "Chapter 7: Conclusion .......................... 47-50", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 120, line: 360, lineRule: "auto" }
        }),
        new Paragraph({
            children: [new TextRun({ text: "References ..................................... 51", bold: false, size: 24, font: "Times New Roman" })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 120, line: 360, lineRule: "auto" }
        })
    ];
}

// Create footer
function createFooter() {
    return new Footer({
        children: [
            new Paragraph({
                children: [new TextRun({ children: [PageNumber.CURRENT], size: 24, font: "Times New Roman" })],
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0 }
            })
        ]
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 AI Report Generator Server running on port ${PORT}`);
});

module.exports = app;