#!/usr/bin/env node

/**
 * Firebase Deployment Status Checker (Node.js version)
 * Cross-platform script to check Firebase deployment status
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log('\n==============================================');
  log(`  ${title}`, 'green');
  console.log('==============================================\n');
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function runCommand(command, silent = true) {
  try {
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return { success: true, output: output.trim() };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

function main() {
  header('Firebase Deployment Status Check');

  const checks = {
    config: false,
    cli: false,
    workflow: false,
    build: false,
    project: null,
  };

  // Check 1: Firebase configuration files
  console.log('1. Checking for Firebase configuration files...');
  if (checkFileExists('firebase.json') && checkFileExists('.firebaserc')) {
    log('✓ Firebase configuration files found', 'green');
    checks.config = true;
  } else {
    log('✗ Firebase configuration files NOT found', 'red');
    console.log('  Missing: firebase.json and/or .firebaserc');
  }
  console.log('');

  // Check 2: Firebase CLI
  console.log('2. Checking for Firebase CLI...');
  const cliCheck = runCommand('firebase --version');
  if (cliCheck.success) {
    log('✓ Firebase CLI is installed', 'green');
    console.log(`  Version: ${cliCheck.output}`);
    checks.cli = true;
  } else {
    log('⚠ Firebase CLI is NOT installed', 'yellow');
    console.log('  Install with: npm install -g firebase-tools');
  }
  console.log('');

  // Check 3: GitHub Actions workflow
  console.log('3. Checking for Firebase deployment workflow...');
  if (checkFileExists('.github/workflows/firebase-deploy.yml') || 
      checkFileExists('.github/workflows/deploy.yml')) {
    log('✓ Firebase deployment workflow found', 'green');
    checks.workflow = true;
  } else {
    log('✗ Firebase deployment workflow NOT found', 'red');
  }
  console.log('');

  // Check 4: Build artifacts
  console.log('4. Checking for build artifacts...');
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath) && fs.readdirSync(distPath).length > 0) {
    log('✓ Build directory (dist/) exists and has files', 'green');
    checks.build = true;
  } else {
    log('⚠ Build directory (dist/) is empty or doesn\'t exist', 'yellow');
    console.log('  Run \'npm run build\' to create build artifacts');
  }
  console.log('');

  // Check 5: Firebase project status (if CLI exists)
  if (checks.cli) {
    console.log('5. Checking Firebase project status...');
    
    const loginCheck = runCommand('firebase projects:list');
    if (loginCheck.success) {
      log('✓ Logged into Firebase', 'green');
      
      if (checks.config) {
        const projectCheck = runCommand('firebase use');
        if (projectCheck.success) {
          const projectMatch = projectCheck.output.match(/Active Project: (\S+)/);
          if (projectMatch) {
            checks.project = projectMatch[1];
            log(`✓ Active Firebase project: ${checks.project}`, 'green');
          }
        }
      }
    } else {
      log('⚠ Not logged into Firebase', 'yellow');
      console.log('  Run \'firebase login\' to authenticate');
    }
    console.log('');
  }

  // Summary
  header('SUMMARY');

  if (checks.config && checks.cli && checks.workflow) {
    log('Firebase is CONFIGURED and ready for deployment', 'green');
    console.log('\nTo deploy:');
    console.log('  1. npm run build');
    console.log('  2. firebase deploy --only hosting');
    
    if (checks.project) {
      console.log(`\nYour app will be live at:`);
      console.log(`  https://${checks.project}.web.app`);
      console.log(`  https://${checks.project}.firebaseapp.com`);
    }
  } else if (!checks.config) {
    log('Firebase is NOT configured', 'red');
    console.log('\nTo set up Firebase:');
    console.log('  1. Install Firebase CLI: npm install -g firebase-tools');
    console.log('  2. Login: firebase login');
    console.log('  3. Initialize: firebase init hosting');
    console.log('  4. Build: npm run build');
    console.log('  5. Deploy: firebase deploy --only hosting');
    console.log('\nOr merge PR #2 which includes Firebase configuration');
  } else {
    log('Firebase is partially configured', 'yellow');
    console.log('\nPlease check the items marked with ✗ above');
  }

  console.log('\nFor detailed instructions, see: FIREBASE_DEPLOYMENT_STATUS.md');
  console.log('==============================================\n');

  // Return status code
  process.exit(checks.config && checks.cli ? 0 : 1);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
