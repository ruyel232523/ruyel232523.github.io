const fs = require('fs');
const path = require('path');

// Configuration
const baseDir = path.join(__dirname, 'documents/academic');
const scriptFile = path.join(__dirname, 'script.js');
const indexFile = path.join(__dirname, 'index.html');

// Helper: Title Case (slug to title)
const toTitleCase = (slug) => {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Helper: Map extension to type
const mapExtensionToType = (ext) => {
    const e = ext.toLowerCase();
    if (['.pdf'].includes(e)) return 'pdf';
    if (['.xlsx', '.xlsm', '.xls', '.csv'].includes(e)) return 'excel';
    if (['.doc', '.docx'].includes(e)) return 'word';
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(e)) return 'archive';
    if (['.mp4', '.mkv', '.avi', '.mov', '.webm'].includes(e)) return 'video';
    return 'code';
};

// Helper: Format file size
const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Helper: Get files recursively
const scanDirectory = (dir, rootDir) => {
    if (!fs.existsSync(dir)) return [];
    const items = fs.readdirSync(dir);

    return items
        .filter(item => {
            // Exclude system files/folders
            return item !== 'README.txt' && !item.startsWith('.') && item !== 'desktop.ini';
        })
        .map(item => {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            const relativePath = path.relative(rootDir, itemPath).replace(/\\/g, '/');

            if (stat.isDirectory()) {
                return {
                    name: item,
                    type: 'folder',
                    size: '-', // Folders don't have a direct size usually
                    date: stat.mtime.toISOString().split('T')[0],
                    children: scanDirectory(itemPath, rootDir) // Recursion
                };
            } else {
                const ext = path.extname(item);
                const projectRoot = path.join(__dirname); // Assuming script is in project root
                // Url needs to be relative to the web root (index.html), which is __dirname
                const webUrl = path.relative(__dirname, itemPath).replace(/\\/g, '/');

                return {
                    name: item,
                    type: mapExtensionToType(ext),
                    size: formatSize(stat.size),
                    date: stat.mtime.toISOString().split('T')[0],
                    url: webUrl
                };
            }
        })
        .sort((a, b) => {
            // Folders first, then files
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;
            return a.name.localeCompare(b.name);
        });
};

// Main Function
const updateProject = () => {
    try {
        // 1. Scan for Categories (Folders in documents/academic)
        const categories = {};
        if (fs.existsSync(baseDir)) {
            const items = fs.readdirSync(baseDir);
            items.forEach(item => {
                const itemPath = path.join(baseDir, item);
                if (fs.statSync(itemPath).isDirectory()) {
                    categories[item] = item;
                }
            });
        }

        // 2. Generate File Data (Recursive)
        const newData = {};
        for (const [key, folderName] of Object.entries(categories)) {
            const dir = path.join(baseDir, folderName);
            // We pass 'dir' as rootDir to keep paths relative to the category folder if needed, 
            // BUT for the 'url' property in files, we need it relative to the website root.
            // The recursor uses 'dir' to scan. 
            newData[key] = scanDirectory(dir, dir);
        }

        // 3. Update script.js
        let scriptContent = fs.readFileSync(scriptFile, 'utf8');
        const scriptRegex = /const fileData = \{[\s\S]*?\};/;
        const newScriptData = `const fileData = ${JSON.stringify(newData, null, 4)};`;

        if (scriptRegex.test(scriptContent)) {
            scriptContent = scriptContent.replace(scriptRegex, newScriptData);
            fs.writeFileSync(scriptFile, scriptContent, 'utf8');
            console.log('✅ Successfully updated script.js with new recursive file data!');
        } else {
            console.error('❌ Error: Could not find "const fileData = { ... };" in script.js');
        }

        // 4. Generate HTML for index.html
        let htmlContent = '\n';
        let delay = 100;

        // Start Grid Container (Removed wrapper as it exists in index.html)

        for (const [key, folderName] of Object.entries(categories)) {
            const title = toTitleCase(folderName);
            htmlContent += `            <div class="repo-card folder-card" data-category="${key}" data-animate="fade-up" data-delay="${delay}">
              <div class="repo-header">
                <div class="repo-icon"><i class="fas fa-folder"></i></div>
                <h3>${title}</h3>
              </div>
              <div class="folder-preview">
                <span>Open Explorer</span>
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>\n`;
            delay += 100;
        }

        // End Grid Container (Removed wrapper)

        // 5. Update index.html
        let indexContent = fs.readFileSync(indexFile, 'utf8');
        const indexRegex = /(<!-- DYNAMIC_REPO_GRID_START -->)[\s\S]*?(<!-- DYNAMIC_REPO_GRID_END -->)/;

        if (indexRegex.test(indexContent)) {
            const replacement = `$1${htmlContent}          $2`;
            indexContent = indexContent.replace(indexRegex, replacement);
            fs.writeFileSync(indexFile, indexContent, 'utf8');
            console.log('✅ Successfully updated index.html with new folder grid!');
        } else {
            console.error('❌ Error: Could not find DYNAMIC_REPO_GRID markers in index.html');
        }

        // Summary
        console.log('\nSummary:');
        Object.entries(newData).forEach(([cat, files]) => {
            console.log(`- ${cat}: ${files.length} top-level items`);
        });

    } catch (err) {
        console.error('❌ Error updating project:', err);
    }
};

updateProject();
