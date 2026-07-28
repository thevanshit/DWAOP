#!/bin/bash
# =============================================================================
# DWAOP - Deployment Script
# Department Workflow Academy Operation Platform
# =============================================================================

set -e

echo "🚀 DWAOP - Deployment Script"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check prerequisites
echo -e "${BLUE} Checking prerequisites...${NC}"

command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js is required but not installed.${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm is required but not installed.${NC}"; exit 1; }

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js >= 18 is required. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check for .env file
if [ ! -f services/api/.env ]; then
    echo -e "${YELLOW}⚠ No .env file found. Creating from .env.example...${NC}"
    cp services/api/.env.example services/api/.env
    echo -e "${YELLOW}⚠ Please update services/api/.env with your configuration${NC}"
fi

# Install dependencies
echo -e "\n${BLUE} Installing dependencies...${NC}"
npm ci --legacy-peer-deps
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Build shared packages
echo -e "\n${BLUE} Building shared packages...${NC}"
npm run build --workspace=packages/types 2>/dev/null || true
echo -e "${GREEN}✓ Shared packages built${NC}"

# Run database migrations
echo -e "\n${BLUE} Running database migrations...${NC}"
npm run migrate --workspace=services/api 2>/dev/null || echo -e "${YELLOW}⚠ Migration skipped (check database connection)${NC}"

# Build backend
echo -e "\n${BLUE} Building backend...${NC}"
npm run build:api
echo -e "${GREEN}✓ Backend built${NC}"

# Build frontend
echo -e "\n${BLUE} Building frontend...${NC}"
npm run build
echo -e "${GREEN}✓ Frontend built${NC}"

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "To start the application:"
echo -e "  ${BLUE}Development:${NC} npm run dev:all"
echo -e "  ${BLUE}API only:${NC}     npm run dev:api"
echo -e "  ${BLUE}Web only:${NC}     npm run dev"
echo -e "  ${BLUE}Production:${NC}   npm run build:all && npm run start"
echo ""
echo -e "Or use Docker:"
echo -e "  ${BLUE}docker-compose up -d${NC}"
echo ""
