#!/usr/bin/env tsx
// TypeScript checker script to find and report all issues

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 Running comprehensive TypeScript check...\n');

// Check if all required files exist
const requiredFiles = [
  'client/src/components/ui/button.tsx',
  'client/src/components/ui/input.tsx',
  'client/src/components/ui/card.tsx',
  'client/src/components/ui/badge.tsx',
  'client/src/components/ui/dialog.tsx',
  'client/src/components/ui/select.tsx',
  'client/src/components/ui/textarea.tsx',
  'client/src/components/ui/tabs.tsx',
  'client/src/components/ui/progress.tsx',
  'client/src/components/ui/slider.tsx',
  'client/src/components/ui/popover.tsx',
  'client/src/components/ui/dropdown-menu.tsx',
  'client/src/components/ui/label.tsx',
  'client/src/components/ui/toaster.tsx',
  'client/src/hooks/use-auth.tsx',
  'client/src/hooks/use-toast.ts',
  'client/src/lib/utils.ts',
  'client/src/lib/queryClient.ts',
  'client/src/lib/protected-route.tsx',
  'server/middleware/security.ts',
  'server/lib/content-moderation.ts'
];

console.log('📁 Checking required files...');
let missingFiles = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    missingFiles.push(file);
    console.log(`❌ Missing: ${file}`);
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

if (missingFiles.length > 0) {
  console.log(`\n⚠️  Found ${missingFiles.length} missing files!`);
} else {
  console.log('\n✅ All required files are present!');
}

// Check TypeScript compilation
console.log('\n🔧 Checking TypeScript compilation...');

try {
  // Check client TypeScript
  console.log('📱 Checking client TypeScript...');
  execSync('cd client && npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ Client TypeScript compilation successful!');
} catch (error) {
  console.log('❌ Client TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
}

try {
  // Check server TypeScript
  console.log('🖥️  Checking server TypeScript...');
  execSync('npx tsc --noEmit -p tsconfig.server.json', { stdio: 'pipe' });
  console.log('✅ Server TypeScript compilation successful!');
} catch (error) {
  console.log('❌ Server TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
}

// Check for common import issues
console.log('\n🔍 Checking for common import issues...');

const checkImports = (filePath: string) => {
  if (!existsSync(filePath)) return;
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Check for missing imports
    if (line.includes('Mic') && !content.includes('import.*Mic')) {
      console.log(`❌ ${filePath}:${index + 1} - Mic not imported`);
    }
    if (line.includes('Users') && !content.includes('import.*Users')) {
      console.log(`❌ ${filePath}:${index + 1} - Users not imported`);
    }
    if (line.includes('Progress') && !content.includes('import.*Progress')) {
      console.log(`❌ ${filePath}:${index + 1} - Progress not imported`);
    }
    if (line.includes('Slider') && !content.includes('import.*Slider')) {
      console.log(`❌ ${filePath}:${index + 1} - Slider not imported`);
    }
    if (line.includes('Popover') && !content.includes('import.*Popover')) {
      console.log(`❌ ${filePath}:${index + 1} - Popover not imported`);
    }
  });
};

// Check key files for import issues
const filesToCheck = [
  'client/src/components/layout/sidebar.tsx',
  'client/src/components/profile/user-profile-card.tsx',
  'client/src/components/community/advanced-filters.tsx',
  'client/src/pages/dashboard.tsx',
  'client/src/pages/community-page.tsx'
];

filesToCheck.forEach(checkImports);

// Check package.json dependencies
console.log('\n📦 Checking package.json dependencies...');

const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
const requiredDeps = [
  'express-rate-limit',
  'helmet',
  'lucide-react',
  '@radix-ui/react-slider',
  '@radix-ui/react-popover',
  '@radix-ui/react-progress'
];

const missingDeps = requiredDeps.filter(dep => 
  !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
);

if (missingDeps.length > 0) {
  console.log('❌ Missing dependencies:');
  missingDeps.forEach(dep => console.log(`   - ${dep}`));
} else {
  console.log('✅ All required dependencies are present!');
}

// Check for environment variables
console.log('\n🌍 Checking environment configuration...');

if (existsSync('.env.local')) {
  console.log('✅ .env.local file exists');
} else if (existsSync('.env.example')) {
  console.log('⚠️  .env.local missing, but .env.example exists');
  console.log('   Run: cp .env.example .env.local');
} else {
  console.log('❌ No environment files found');
}

console.log('\n🎯 TypeScript check completed!');
console.log('\n📋 Summary:');
console.log(`   Missing files: ${missingFiles.length}`);
console.log(`   Missing dependencies: ${missingDeps.length}`);

if (missingFiles.length === 0 && missingDeps.length === 0) {
  console.log('\n🎉 Project looks good! Try running the development server.');
} else {
  console.log('\n🔧 Please fix the issues above and run the check again.');
}
