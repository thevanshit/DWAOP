
const API_URL = 'http://localhost:3001/api';

async function testWorkflow() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'student@campus.edu',
                password: 'password123'
            })
        });

        if (!loginRes.ok) throw new Error(await loginRes.text());

        const loginResult: any = await loginRes.json();
        const token = loginResult.data.tokens.accessToken;
        const user = loginResult.data.user;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        console.log('Login successful.');

        // 2. Create Workflow
        console.log('Creating Leave Request Workflow...');
        const createData = {
            type: 'leave_request',
            title: 'Sick Leave Check',
            description: 'Test leave request from script',
            departmentId: user.departmentId || 'd3000000-0000-0000-0000-000000000003',
            priority: 'high',
            metadata: { reason: 'Fever' }
        };

        const createRes = await fetch(`${API_URL}/workflows`, {
            method: 'POST',
            headers,
            body: JSON.stringify(createData)
        });

        if (!createRes.ok) throw new Error(await createRes.text());

        const createResult: any = await createRes.json();
        console.log('Workflow created:', createResult);
        const workflowId = createResult.data.workflow.id;

        // 3. Get Workflows
        console.log('Fetching Workflows...');
        const listRes = await fetch(`${API_URL}/workflows`, {
            method: 'GET',
            headers
        });

        if (!listRes.ok) throw new Error(await listRes.text());

        const listResult: any = await listRes.json();
        console.log('Workflows found:', listResult.data.workflows.length);

        // 4. Transition Workflow
        console.log('Transitioning Workflow (Submit for Review)...');
        const transitionData = {
            toState: 'under_review',
            reason: 'Submit for review'
        };

        const transitionRes = await fetch(`${API_URL}/workflows/${workflowId}/transition`, {
            method: 'POST',
            headers,
            body: JSON.stringify(transitionData)
        });

        if (!transitionRes.ok) throw new Error(await transitionRes.text());

        const transitionResult: any = await transitionRes.json();
        console.log('Workflow transitioned:', transitionResult);

        // 5. Approve Workflow
        console.log('Transitioning Workflow (Approve)...');
        const approveData = {
            toState: 'approved',
            reason: 'Approved by admin script'
        };

        const approveRes = await fetch(`${API_URL}/workflows/${workflowId}/transition`, {
            method: 'POST',
            headers,
            body: JSON.stringify(approveData)
        });

        if (!approveRes.ok) throw new Error(await approveRes.text());

        const approveResult: any = await approveRes.json();
        console.log('Workflow approved:', approveResult);

        if (approveResult.data.workflow.currentState === 'approved') {
            console.log('Test PASSED: Workflow status is approved.');
        } else {
            console.error('Test FAILED: Workflow currentState is ' + approveResult.data.workflow.currentState);
            process.exit(1);
        }

    } catch (error: any) {
        console.error('Workflow Test Failed:', error);
        process.exit(1);
    }
}

testWorkflow();
