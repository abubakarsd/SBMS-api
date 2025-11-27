import fetch from 'node-fetch';

const baseUrl = 'http://localhost:3000';

const runTests = async () => {
    try {
        const email = `test${Date.now()}@example.com`;
        const password = 'password123';

        // 1. Register
        console.log('--- Registering User ---');
        const registerRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                role: 'admin',
                name: 'Test User',
                store_id: 'store1'
            })
        });
        const registerData = await registerRes.json();
        console.log('Status:', registerRes.status);
        console.log('Response:', registerData);

        if (registerRes.status !== 201) throw new Error('Registration failed');

        // 2. Login
        console.log('\n--- Logging In ---');
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        console.log('Status:', loginRes.status);
        // console.log('Response:', loginData);

        if (loginRes.status !== 200) throw new Error('Login failed');
        const token = loginData.token;
        console.log('Token received');

        // 3. Add Product
        console.log('\n--- Adding Product ---');
        const productRes = await fetch(`${baseUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Test Product',
                sku: `SKU-${Date.now()}`,
                category: 'Electronics',
                price: 100,
                quantity: 50,
                minQuantity: 10
            })
        });
        const productData = await productRes.json();
        console.log('Status:', productRes.status);
        console.log('Response:', productData);

        // 4. Get Products
        console.log('\n--- Fetching Products ---');
        const getProductsRes = await fetch(`${baseUrl}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const products = await getProductsRes.json();
        console.log('Status:', getProductsRes.status);
        console.log('Product count:', Array.isArray(products) ? products.length : products);

    } catch (error) {
        console.error('Test failed:', error);
    }
};

runTests();
