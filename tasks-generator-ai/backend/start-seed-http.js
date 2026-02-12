const http = require('http');

const testCases = [
    {
        goal: "Build a comprehensive admin dashboard for an e-commerce platform to manage products, orders, and customers.",
        users: "Store Administrators, Support Staff, Inventory Managers",
        constraints: "Must use React Table for data grids, support dark mode, and role-based access control (RBAC).",
        templateType: "Scale-up"
    },
    {
        goal: "A mobile app to track daily steps, water intake, and workouts with gamification elements like badges and streaks.",
        users: "Fitness enthusiasts, casual users wanting to improve health.",
        constraints: "Mobile-first design, offline support (PWA), integration with device sensors (simulated).",
        templateType: "MVP"
    },
    {
        goal: "An internal portal to streamline the onboarding process for new employees, including document signing and training modules.",
        users: "HR Managers, New Hires.",
        constraints: "Strict data privacy (GDPR compliance), integration with PDF signing, secure document storage.",
        templateType: "Internal Tool"
    },
    {
        goal: "A CLI tool that analyzes code files and generates unit tests automatically using an LLM.",
        users: "Software Developers, QA Engineers.",
        constraints: "Written in Node.js, zero-config usage, supports JavaScript/TypeScript files only.",
        templateType: "General"
    }
];

const postData = (data) => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/specs/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let responseBody = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => { responseBody += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(responseBody));
                } else {
                    reject(new Error(`Status Code: ${res.statusCode}, Body: ${responseBody}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
};

const seedSpecs = async () => {
    console.log("🚀 Starting verification (HTTP version)...");

    for (const [index, testCase] of testCases.entries()) {
        console.log(`\n[${index + 1}/${testCases.length}] Generating: ${testCase.goal.substring(0, 30)}...`);
        try {
            const data = await postData(testCase);
            console.log(`✅ Success! Generated Spec ID: ${data.data._id}`);
            console.log(`   Detailed Tasks generated: ${data.data.tasks.length}`);
        } catch (error) {
            console.error(`❌ Failed: ${error.message}`);
        }
    }
    console.log("\n✨ All test cases processed.");
};

seedSpecs();
