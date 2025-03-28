#!/bin/bash

# Create a clean version of the problematic file
echo '// Clean version of NewDashboard to resolve parsing issues
import Dashboard from "./Dashboard";
export default Dashboard;' > ./src/components/dashboard/NewDashboard.jsx

# Remove any existing build directory
rm -rf ./build

# Clear any caches
rm -rf ./node_modules/.cache

echo "Cache cleared and problematic file replaced. Try rebuilding now."
