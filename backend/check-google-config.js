const fs = require('fs');
const path = require('path');

console.log('🔍 TrackMate Google OAuth Configuration Checker\n');
console.log('='.repeat(60));

// Load backend .env
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('\n📋 Backend Configuration:');
console.log('-'.repeat(60));
console.log('✓ PORT:', process.env.PORT || '5001 (default)');
console.log('✓ MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('✓ JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('✓ GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('✓ GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');

if (process.env.GOOGLE_CLIENT_ID) {
    console.log('  → Client ID:', process.env.GOOGLE_CLIENT_ID.substring(0, 30) + '...');
}

console.log('\n📋 Frontend Configuration:');
console.log('-'.repeat(60));

// Check frontend .env
const frontendEnvPath = path.join(__dirname, '../frontend/.env');
if (fs.existsSync(frontendEnvPath)) {
    const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
    const frontendClientId = frontendEnv.match(/VITE_GOOGLE_CLIENT_ID=(.+)/)?.[1]?.trim();
    const frontendApiUrl = frontendEnv.match(/VITE_API_URL=(.+)/)?.[1]?.trim();
    
    console.log('✓ VITE_GOOGLE_CLIENT_ID:', frontendClientId ? '✅ Set' : '❌ Missing');
    console.log('✓ VITE_API_URL:', frontendApiUrl || '❌ Missing');
    
    if (frontendClientId) {
        console.log('  → Client ID:', frontendClientId.substring(0, 30) + '...');
    }
    
    // Check if IDs match
    if (process.env.GOOGLE_CLIENT_ID && frontendClientId) {
        if (process.env.GOOGLE_CLIENT_ID === frontendClientId) {
            console.log('\n✅ Client IDs MATCH between backend and frontend');
        } else {
            console.log('\n❌ WARNING: Client IDs DO NOT MATCH!');
            console.log('   Backend:', process.env.GOOGLE_CLIENT_ID.substring(0, 30) + '...');
            console.log('   Frontend:', frontendClientId.substring(0, 30) + '...');
        }
    }
} else {
    console.log('❌ Frontend .env file not found');
}

console.log('\n📋 Required Google Cloud Console Setup:');
console.log('-'.repeat(60));
console.log('1. OAuth Consent Screen:');
console.log('   → Status: Must be configured');
console.log('   → User Type: External');
console.log('   → Test Users: Add venkatareddy15052005@gmail.com');
console.log('');
console.log('2. OAuth 2.0 Client ID:');
console.log('   → Authorized JavaScript origins:');
console.log('     • http://localhost:5173');
console.log('     • http://127.0.0.1:5173');
console.log('     • https://trackmate-rs.netlify.app');
console.log('');
console.log('   → Authorized redirect URIs:');
console.log('     • http://localhost:5173');
console.log('     • http://127.0.0.1:5173');
console.log('     • https://trackmate-rs.netlify.app');

console.log('\n📋 Common Issues & Solutions:');
console.log('-'.repeat(60));
console.log('❌ "Access blocked: This app\'s request is invalid"');
console.log('   → OAuth consent screen not configured');
console.log('   → Test user not added (if app is in Testing mode)');
console.log('   → Solution: Follow GOOGLE_OAUTH_FIX.md');
console.log('');
console.log('❌ "redirect_uri_mismatch"');
console.log('   → Redirect URI not in Google Console');
console.log('   → Solution: Add exact URL to Authorized redirect URIs');
console.log('');
console.log('❌ "Global Google authentication failure"');
console.log('   → Token verification failed on backend');
console.log('   → Client ID mismatch between frontend/backend');
console.log('   → Solution: Check .env files match');

console.log('\n🔗 Useful Links:');
console.log('-'.repeat(60));
console.log('• Google Cloud Console: https://console.cloud.google.com/apis/credentials');
console.log('• OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent');
console.log('• Documentation: See GOOGLE_OAUTH_FIX.md');

console.log('\n' + '='.repeat(60));
console.log('✅ Configuration check complete!\n');
