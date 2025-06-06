/**
 * Profile Encryption Test API
 * 
 * This API endpoint allows testing the profile encryption system.
 * It should be removed or protected in production.
 */

import type { Route } from "./+types/test-encryption";
import { 
  runAllTests,
  testBasicEncryption,
  testConsistency,
  testMultipleCounselors,
  testEdgeCases,
  testPerformance,
} from "~/core/lib/profile-encryption-test.server";

export async function loader({ request }: Route.LoaderArgs) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    throw new Response('Not available in production', { status: 404 });
  }
  
  const url = new URL(request.url);
  const testType = url.searchParams.get('test') || 'all';
  
  // Capture console output
  const originalLog = console.log;
  const originalError = console.error;
  const logs: string[] = [];
  
  console.log = (...args) => {
    logs.push(args.join(' '));
    originalLog(...args);
  };
  
  console.error = (...args) => {
    logs.push(`ERROR: ${args.join(' ')}`);
    originalError(...args);
  };
  
  try {
    let testResult;
    
    switch (testType) {
      case 'basic':
        testResult = await testBasicEncryption();
        break;
      case 'consistency':
        testResult = await testConsistency();
        break;
      case 'multiple':
        testResult = await testMultipleCounselors();
        break;
      case 'edge':
        testResult = await testEdgeCases();
        break;
      case 'performance':
        testResult = await testPerformance();
        break;
      case 'all':
      default:
        testResult = await runAllTests();
        break;
    }
    
    return new Response(JSON.stringify({
      success: true,
      testType,
      logs,
      message: 'Tests completed successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      testType,
      logs,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } finally {
    // Restore console
    console.log = originalLog;
    console.error = originalError;
  }
}
