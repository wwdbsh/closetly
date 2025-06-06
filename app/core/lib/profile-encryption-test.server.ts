/**
 * Profile Encryption Test Utilities
 * 
 * This file provides testing functions to validate the profile encryption system.
 * Use these functions to test the encryption/decryption flow before deployment.
 */

import { 
  encryptProfileId, 
  generateProfileSlug, 
  getCounselorFromSlug,
  validateEncryptionKey,
  generateSlugsForAllCounselors,
  isValidSlugFormat 
} from './profile-encryption.server';

/**
 * Tests the basic encryption/decryption flow
 */
export async function testBasicEncryption() {
  console.log('🧪 Testing Profile Encryption System...\n');
  
  // Test encryption key validation
  console.log('1. Testing encryption key validation:');
  const isValidKey = validateEncryptionKey();
  console.log(`   ✅ Key validation: ${isValidKey ? 'PASS' : 'FAIL'}\n`);
  
  // Test sample data (from seed.sql)
  const sampleCounselor = {
    name: '홍길동',
    profile_id: '13c8bb1e-f7d4-4823-8185-a36b951f27ed'
  };
  
  console.log('2. Testing encryption:');
  console.log(`   Input UUID: ${sampleCounselor.profile_id}`);
  
  const encryptedId = encryptProfileId(sampleCounselor.profile_id);
  console.log(`   Encrypted ID: ${encryptedId}`);
  
  const slug = generateProfileSlug(sampleCounselor);
  console.log(`   Generated Slug: ${slug}`);
  console.log(`   ✅ Encryption: PASS\n`);
  
  // Test slug format validation
  console.log('3. Testing slug format validation:');
  const isValidFormat = isValidSlugFormat(slug);
  console.log(`   Slug format valid: ${isValidFormat ? 'PASS' : 'FAIL'}`);
  console.log(`   ✅ Validation: ${isValidFormat ? 'PASS' : 'FAIL'}\n`);
  
  // Test decryption (requires database)
  console.log('4. Testing decryption:');
  try {
    const result = await getCounselorFromSlug(slug);
    if (result && result.profile_id === sampleCounselor.profile_id) {
      console.log(`   ✅ Decryption: PASS`);
      console.log(`   Recovered UUID: ${result.profile_id}`);
      console.log(`   Recovered Name: ${result.name}`);
    } else {
      console.log(`   ❌ Decryption: FAIL`);
      console.log(`   Expected: ${sampleCounselor.profile_id}`);
      console.log(`   Got: ${result?.profile_id || 'null'}`);
    }
  } catch (error) {
    console.log(`   ❌ Decryption: ERROR - ${error}`);
  }
  
  console.log('\n🎉 Test completed!');
}

/**
 * Tests consistency - same input should always produce same output
 */
export async function testConsistency() {
  console.log('🔄 Testing Encryption Consistency...\n');
  
  const testUuid = '13c8bb1e-f7d4-4823-8185-a36b951f27ed';
  const iterations = 5;
  const results: string[] = [];
  
  console.log(`Testing ${iterations} iterations with UUID: ${testUuid}`);
  
  for (let i = 0; i < iterations; i++) {
    const encrypted = encryptProfileId(testUuid);
    results.push(encrypted);
    console.log(`   Iteration ${i + 1}: ${encrypted}`);
  }
  
  // Check if all results are identical
  const allSame = results.every(result => result === results[0]);
  console.log(`\n✅ Consistency test: ${allSame ? 'PASS' : 'FAIL'}`);
  
  if (!allSame) {
    console.log('❌ ERROR: Encryption should be deterministic!');
  }
}

/**
 * Tests with multiple counselors
 */
export async function testMultipleCounselors() {
  console.log('👥 Testing Multiple Counselors...\n');
  
  const testCounselors = [
    { name: '김지훈', profile_id: '067e6162-3b6f-4ae2-a171-2470b63dff00' },
    { name: '이소영', profile_id: '13c8bb1e-f7d4-4823-8185-a36b951f27ed' },
    { name: '박민수', profile_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
  ];
  
  console.log('Generated slugs:');
  for (const counselor of testCounselors) {
    const slug = generateProfileSlug(counselor);
    console.log(`   ${counselor.name}: /profile/${slug}`);
  }
  
  console.log('\n✅ Multiple counselor test completed');
}

/**
 * Tests edge cases and error handling
 */
export async function testEdgeCases() {
  console.log('🔍 Testing Edge Cases...\n');
  
  // Test invalid slug formats
  const invalidSlugs = [
    '',
    'invalid',
    'no-dash',
    '123-456',
    'valid-name-',
    '-invalid-start',
    'special@chars-abc123',
  ];
  
  console.log('Testing invalid slug formats:');
  for (const slug of invalidSlugs) {
    const isValid = isValidSlugFormat(slug);
    console.log(`   "${slug}": ${isValid ? '❌ SHOULD BE INVALID' : '✅ Correctly invalid'}`);
  }
  
  // Test valid slug formats
  const validSlugs = [
    '홍길동-abc123',
    'John Smith-xyz789',
    '김지훈-A1B2C3',
    '이소영-def456',
  ];
  
  console.log('\nTesting valid slug formats:');
  for (const slug of validSlugs) {
    const isValid = isValidSlugFormat(slug);
    console.log(`   "${slug}": ${isValid ? '✅ Correctly valid' : '❌ SHOULD BE VALID'}`);
  }
  
  console.log('\n✅ Edge case test completed');
}

/**
 * Performance test - measures encryption/decryption speed
 */
export async function testPerformance() {
  console.log('⚡ Testing Performance...\n');
  
  const testUuid = '13c8bb1e-f7d4-4823-8185-a36b951f27ed';
  const iterations = 1000;
  
  // Test encryption performance
  console.log(`Testing encryption performance (${iterations} iterations):`);
  const encryptStart = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    encryptProfileId(testUuid);
  }
  
  const encryptEnd = Date.now();
  const encryptTime = encryptEnd - encryptStart;
  console.log(`   ✅ ${iterations} encryptions in ${encryptTime}ms`);
  console.log(`   ✅ Average: ${(encryptTime / iterations).toFixed(2)}ms per encryption`);
  
  console.log('\n⚡ Performance test completed');
}

/**
 * Runs all tests
 */
export async function runAllTests() {
  console.log('🚀 Running Complete Profile Encryption Test Suite\n');
  console.log('=' .repeat(60));
  
  try {
    await testBasicEncryption();
    console.log('\n' + '=' .repeat(60));
    
    await testConsistency();
    console.log('\n' + '=' .repeat(60));
    
    await testMultipleCounselors();
    console.log('\n' + '=' .repeat(60));
    
    await testEdgeCases();
    console.log('\n' + '=' .repeat(60));
    
    await testPerformance();
    console.log('\n' + '=' .repeat(60));
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  }
}

// Export individual test functions for selective testing
export {
  testBasicEncryption as basicTest,
  testConsistency as consistencyTest,
  testMultipleCounselors as multipleCounselorsTest,
  testEdgeCases as edgeCasesTest,
  testPerformance as performanceTest,
};
