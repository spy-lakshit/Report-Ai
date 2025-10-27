// Ultra-minimal Vercel serverless function
module.exports = async (req, res) => {
    try {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Handle preflight
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        const { method, url } = req;
        
        // Health check
        if (method === 'GET' && (url === '/api/health' || url.includes('health'))) {
            return res.status(200).json({ 
                status: 'OK', 
                message: 'Ultra-minimal function is working!',
                timestamp: new Date().toISOString(),
                method: method,
                url: url
            });
        }
        
        // Generate report (simplified)
        if (method === 'POST' && (url === '/api/generate-report' || url.includes('generate-report'))) {
            const sessionId = Date.now().toString();
            
            // Just return success without actually generating anything
            return res.status(200).json({ 
                sessionId: sessionId,
                message: 'Report generation started (simplified)',
                status: 'success'
            });
        }
        
        // Progress check
        if (method === 'GET' && url.includes('progress')) {
            return res.status(200).json({
                progress: 100,
                status: 'Completed (simplified)',
                message: 'This is a test response'
            });
        }
        
        // Default response
        return res.status(200).json({
            message: 'Ultra-minimal API is working',
            method: method,
            url: url,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        // Even if everything fails, return a response
        return res.status(200).json({
            error: 'Something went wrong',
            message: error.message || 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
};