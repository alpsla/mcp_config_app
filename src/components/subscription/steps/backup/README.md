# Backup Files

This directory contains backup copies of previous versions of components. These files are kept for reference only and are not meant to be used in the application.

## Files Included

- Previous versions of components that have been refactored or replaced
- Experimental implementations that weren't used in the final application
- Reference code for future development

## File Extensions

- `.nots` - TypeScript/React files that are not meant to be compiled (renamed from .tsx to avoid TypeScript errors)
- `.bak` - Backup files
- `.backup.css` - Backup CSS files
- `.backup.md` - Backup documentation files

## Notes for Developers

These files are excluded from TypeScript compilation and should not be imported into the active codebase. If you need to reference or restore code from these backups, copy the relevant parts to new files rather than trying to use these files directly.

## Cleanup

When you're confident that you no longer need these backup files, you can safely delete this directory.