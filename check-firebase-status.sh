#!/bin/bash

# Firebase Deployment Status Checker
# This script checks if Firebase is configured and deployed

echo "=============================================="
echo "  Firebase Deployment Status Check"
echo "=============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Firebase configuration files
echo "1. Checking for Firebase configuration files..."
if [ -f "firebase.json" ] && [ -f ".firebaserc" ]; then
    echo -e "${GREEN}✓ Firebase configuration files found${NC}"
    CONFIG_EXISTS=true
else
    echo -e "${RED}✗ Firebase configuration files NOT found${NC}"
    echo "  Missing: firebase.json and/or .firebaserc"
    CONFIG_EXISTS=false
fi
echo ""

# Check 2: Firebase CLI
echo "2. Checking for Firebase CLI..."
if command -v firebase &> /dev/null; then
    echo -e "${GREEN}✓ Firebase CLI is installed${NC}"
    firebase --version
    CLI_EXISTS=true
else
    echo -e "${YELLOW}⚠ Firebase CLI is NOT installed${NC}"
    echo "  Install with: npm install -g firebase-tools"
    CLI_EXISTS=false
fi
echo ""

# Check 3: GitHub Actions workflow
echo "3. Checking for Firebase deployment workflow..."
if [ -f ".github/workflows/firebase-deploy.yml" ] || [ -f ".github/workflows/deploy.yml" ]; then
    echo -e "${GREEN}✓ Firebase deployment workflow found${NC}"
    WORKFLOW_EXISTS=true
else
    echo -e "${RED}✗ Firebase deployment workflow NOT found${NC}"
    WORKFLOW_EXISTS=false
fi
echo ""

# Check 4: Build artifacts
echo "4. Checking for build artifacts..."
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    echo -e "${GREEN}✓ Build directory (dist/) exists and has files${NC}"
    BUILD_EXISTS=true
else
    echo -e "${YELLOW}⚠ Build directory (dist/) is empty or doesn't exist${NC}"
    echo "  Run 'npm run build' to create build artifacts"
    BUILD_EXISTS=false
fi
echo ""

# Check 5: If CLI exists and logged in, check active project
if [ "$CLI_EXISTS" = true ]; then
    echo "5. Checking Firebase project status..."
    
    # Check if logged in
    if firebase projects:list &> /dev/null; then
        echo -e "${GREEN}✓ Logged into Firebase${NC}"
        
        # Try to get current project
        if [ -f ".firebaserc" ]; then
            PROJECT=$(firebase use 2>&1 | grep "Active Project" | awk '{print $3}')
            if [ -n "$PROJECT" ]; then
                echo -e "${GREEN}✓ Active Firebase project: $PROJECT${NC}"
                
                # Check deployment status
                echo ""
                echo "6. Checking deployment history..."
                echo "Recent deployments:"
                firebase hosting:channel:list 2>&1 | head -20 || echo -e "${YELLOW}No deployment channels found${NC}"
            else
                echo -e "${YELLOW}⚠ No active Firebase project${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}⚠ Not logged into Firebase${NC}"
        echo "  Run 'firebase login' to authenticate"
    fi
    echo ""
fi

# Summary
echo "=============================================="
echo "  SUMMARY"
echo "=============================================="
echo ""

if [ "$CONFIG_EXISTS" = true ] && [ "$CLI_EXISTS" = true ] && [ "$WORKFLOW_EXISTS" = true ]; then
    echo -e "${GREEN}Firebase is CONFIGURED and ready for deployment${NC}"
    echo ""
    echo "To deploy:"
    echo "  1. npm run build"
    echo "  2. firebase deploy --only hosting"
elif [ "$CONFIG_EXISTS" = false ]; then
    echo -e "${RED}Firebase is NOT configured${NC}"
    echo ""
    echo "To set up Firebase:"
    echo "  1. Install Firebase CLI: npm install -g firebase-tools"
    echo "  2. Login: firebase login"
    echo "  3. Initialize: firebase init hosting"
    echo "  4. Build: npm run build"
    echo "  5. Deploy: firebase deploy --only hosting"
    echo ""
    echo "Or merge PR #2 which includes Firebase configuration"
else
    echo -e "${YELLOW}Firebase is partially configured${NC}"
    echo ""
    echo "Please check the items marked with ✗ above"
fi

echo ""
echo "For detailed instructions, see: FIREBASE_DEPLOYMENT_STATUS.md"
echo "=============================================="
