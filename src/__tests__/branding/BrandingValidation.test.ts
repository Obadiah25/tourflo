import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

describe('TourFlo Branding Validation Tests', () => {
  const projectRoot = join(__dirname, '../../..');
  const srcDir = join(projectRoot, 'src');

  const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
    const files = readdirSync(dirPath);

    files.forEach(file => {
      const filePath = join(dirPath, file);
      if (statSync(filePath).isDirectory()) {
        if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
          arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        }
      } else if (file.match(/\.(tsx?|jsx?|json|md)$/)) {
        arrayOfFiles.push(filePath);
      }
    });

    return arrayOfFiles;
  };

  describe('LookYah Brand Removal', () => {
    it('should verify no "LookYah" strings remain in source code', () => {
      const files = getAllFiles(srcDir);
      const violations: { file: string; line: number; content: string }[] = [];

      files.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (line.match(/lookyah/i) && !line.includes('LOOKYAH_DATA_STRUCTURE_ANALYSIS')) {
            violations.push({
              file: file.replace(projectRoot, ''),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      });

      expect(violations, `Found LookYah references:\n${JSON.stringify(violations, null, 2)}`).toHaveLength(0);
    });

    it('should verify no LookYah in component names', () => {
      const files = getAllFiles(srcDir);
      const violations: string[] = [];

      files.forEach(file => {
        const fileName = file.split('/').pop() || '';
        if (fileName.match(/lookyah/i)) {
          violations.push(file.replace(projectRoot, ''));
        }
      });

      expect(violations).toHaveLength(0);
    });

    it('should verify no LookYah in CSS classes or IDs', () => {
      const files = getAllFiles(srcDir);
      const violations: { file: string; match: string }[] = [];

      files.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        const classMatches = content.match(/className=["'][^"']*lookyah[^"']*["']/gi);
        const idMatches = content.match(/id=["'][^"']*lookyah[^"']*["']/gi);

        if (classMatches) {
          classMatches.forEach(match => violations.push({ file: file.replace(projectRoot, ''), match }));
        }
        if (idMatches) {
          idMatches.forEach(match => violations.push({ file: file.replace(projectRoot, ''), match }));
        }
      });

      expect(violations).toHaveLength(0);
    });
  });

  describe('JAHBOI to FlorBot Migration', () => {
    it('should verify no "JAHBOI" strings remain in code', () => {
      const files = getAllFiles(srcDir);
      const violations: { file: string; line: number; content: string }[] = [];

      files.forEach(file => {
        if (file.includes('jahboi.ts') || file.includes('JAHBOI')) {
          return;
        }

        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (line.match(/jahboi/i)) {
            violations.push({
              file: file.replace(projectRoot, ''),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      });

      expect(violations, `Found JAHBOI references:\n${JSON.stringify(violations, null, 2)}`).toHaveLength(0);
    });

    it('should verify FlorBot is used in chat components', () => {
      const chatFile = join(srcDir, 'components/ChatScreen.tsx');
      const content = readFileSync(chatFile, 'utf-8');

      expect(content).toContain('FlorBot');
      expect(content).not.toContain('JAHBOI');
    });

    it('should verify FlorBot uses Florida context', () => {
      const florBotFile = join(srcDir, 'lib/florbot.ts');

      try {
        const content = readFileSync(florBotFile, 'utf-8');
        expect(content).toContain('Florida');
        expect(content).not.toContain('Jamaica');
        expect(content).not.toContain('irie');
        expect(content).not.toContain('yah mon');
      } catch (error) {
        const jahboiFile = join(srcDir, 'lib/jahboi.ts');
        const content = readFileSync(jahboiFile, 'utf-8');

        expect(content).toContain('FlorBot');
        expect(content).toContain('Florida');
      }
    });
  });

  describe('Currency Reference Removal', () => {
    it('should verify no "JMD" currency references exist', () => {
      const files = getAllFiles(srcDir);
      const violations: { file: string; line: number; content: string }[] = [];

      files.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (line.match(/['"]JMD['"]/) || line.match(/J\$/)) {
            violations.push({
              file: file.replace(projectRoot, ''),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      });

      expect(violations, `Found JMD currency references:\n${JSON.stringify(violations, null, 2)}`).toHaveLength(0);
    });

    it('should verify USD is default currency in configs', () => {
      const files = getAllFiles(srcDir);
      let foundUSD = false;

      files.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        if (content.match(/currency.*USD/i) || content.match(/defaultCurrency.*USD/i)) {
          foundUSD = true;
        }
      });

      expect(foundUSD).toBe(true);
    });

    it('should verify no Jamaican dollar symbols exist', () => {
      const files = getAllFiles(srcDir);
      const violations: string[] = [];

      files.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        if (content.includes('J$') && !content.includes('//') && !content.includes('test')) {
          violations.push(file.replace(projectRoot, ''));
        }
      });

      expect(violations).toHaveLength(0);
    });
  });

  describe('Geographic Reference Updates', () => {
    it('should verify no Jamaica parish names exist in code', () => {
      const files = getAllFiles(srcDir);
      const parishes = ['St. Ann', 'Portland', 'Westmoreland', 'Hanover', 'Trelawny', 'St. James'];
      const violations: { file: string; parish: string; line: number }[] = [];

      files.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        parishes.forEach(parish => {
          lines.forEach((line, index) => {
            if (line.includes(parish) && !line.includes('//') && !line.includes('test')) {
              violations.push({
                file: file.replace(projectRoot, ''),
                parish,
                line: index + 1
              });
            }
          });
        });
      });

      expect(violations, `Found parish references:\n${JSON.stringify(violations, null, 2)}`).toHaveLength(0);
    });

    it('should verify Florida counties are used instead', () => {
      const files = getAllFiles(srcDir);
      const counties = ['Miami-Dade', 'Orange', 'Broward', 'Palm Beach'];
      let foundCounties = false;

      files.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        if (counties.some(county => content.includes(county))) {
          foundCounties = true;
        }
      });

      expect(foundCounties).toBe(true);
    });

    it('should verify "county" is used instead of "parish" in location fields', () => {
      const files = getAllFiles(srcDir);
      const violations: string[] = [];

      files.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        const parishFieldMatches = content.match(/parish['":\s]/gi);

        if (parishFieldMatches && !file.includes('test') && !file.includes('MIGRATION')) {
          violations.push(file.replace(projectRoot, ''));
        }
      });

      expect(violations).toHaveLength(0);
    });
  });

  describe('Logo and Favicon Validation', () => {
    it('should verify TourFlo logo files exist in public directory', () => {
      const publicDir = join(projectRoot, 'public');

      try {
        const files = readdirSync(publicDir);
        const hasLogo = files.some(f =>
          f.toLowerCase().includes('logo') ||
          f.toLowerCase().includes('tourflo')
        );

        expect(hasLogo).toBe(true);
      } catch (error) {
      }
    });

    it('should verify no LookYah logo references in HTML', () => {
      const indexHtml = join(projectRoot, 'index.html');
      const content = readFileSync(indexHtml, 'utf-8');

      expect(content).not.toContain('lookyah');
      expect(content.toLowerCase()).not.toContain('lookyah');
    });

    it('should verify manifest.json has TourFlo branding', () => {
      const manifestPath = join(projectRoot, 'public/manifest.json');

      try {
        const content = readFileSync(manifestPath, 'utf-8');
        const manifest = JSON.parse(content);

        expect(manifest.name || manifest.short_name).toContain('TourFlo');
        expect(manifest.name || '').not.toContain('LookYah');
      } catch (error) {
      }
    });
  });

  describe('Environment Variable Validation', () => {
    it('should verify no LookYah references in .env variables', () => {
      const envPath = join(projectRoot, '.env');

      try {
        const content = readFileSync(envPath, 'utf-8');
        expect(content).not.toMatch(/lookyah/i);
      } catch (error) {
      }
    });

    it('should verify Supabase project URL is updated if needed', () => {
      const envPath = join(projectRoot, '.env');

      try {
        const content = readFileSync(envPath, 'utf-8');
        const hasSupabaseUrl = content.includes('VITE_SUPABASE_URL');
        expect(hasSupabaseUrl).toBe(true);
      } catch (error) {
      }
    });
  });
});
