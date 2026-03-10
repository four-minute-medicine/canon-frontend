
export const fixMarkdown = (content: string): string => {
    if (!content) return content;

    let fixed = content;

    // Normalise line endings first
    fixed = fixed.replace(/\r\n/g, '\n');

    // Fix bold syntax where ** is on a separate line from the text
    // Pattern: ** followed by whitespace/newlines, then text, then whitespace/newlines followed by **
    fixed = fixed.replace(/\*\*\s*\n\s*([\s\S]*?)\n\s*\*\*/g, '**$1**');
    
    // Fix bold syntax where opening ** is on separate line
    fixed = fixed.replace(/\*\*\s*\n\s*/g, '**');
    
    // Fix bold syntax where closing ** is on separate line
    fixed = fixed.replace(/\s*\n\s*\*\*/g, '**');

    // Fix italic syntax where * is on a separate line (but not ** which is bold)
    // Opening italic on separate line
    fixed = fixed.replace(/(?<!\*)\*(?!\*)\s*\n\s*/g, '*');
    
    // Closing italic on separate line
    fixed = fixed.replace(/\s*\n\s*(?<!\*)\*(?!\*)/g, '*');

    // Fix underscore italic syntax where _ is on a separate line
    fixed = fixed.replace(/(?<!_)_(?!_)\s*\n\s*/g, '_');
    fixed = fixed.replace(/\s*\n\s*(?<!_)_(?!_)/g, '_');

    // Fix bold with underscore where __ is on a separate line
    fixed = fixed.replace(/__\s*\n\s*/g, '__');
    fixed = fixed.replace(/\s*\n\s*__/g, '__');

    // Clean up excessive whitespace between ** markers on the same line
    fixed = fixed.replace(/\*\*\s{2,}/g, '**');
    fixed = fixed.replace(/\s{2,}\*\*/g, '**');

    // Fix cases where there's trailing whitespace before closing markdown
    fixed = fixed.replace(/\s+(\*\*|\*|__?)\s*$/gm, '$1');

    // Put numbered lists on their own line when they are attached to prose/headings
    fixed = fixed.replace(/([^\n])(\d+\.\s+)/g, '$1\n$2');

    // Put bullet list markers on their own line when attached to prose
    fixed = fixed.replace(/([A-Za-z0-9)])\s*-\s+(?=[A-Z])/g, '$1\n- ');

    // Remove leading indentation that turns normal prose into code blocks
    fixed = fixed.replace(/^( {2,})(?=[A-Za-z*])/gm, '');

    fixed = fixed
        .split('\n')
        .map((line) => {
            const trimmed = line.trim();

            if (trimmed === '**' || trimmed === '*') {
                return '';
            }

            if (/^\d+\.\s+\*\*[^*]+$/.test(trimmed)) {
                return trimmed + '**';
            }

            if (/^-\s+\*\*[^*]+$/.test(trimmed)) {
                return trimmed + '**';
            }

            if (/^\*\*-\s+\*\*[^*]+$/.test(trimmed)) {
                return trimmed.replace(/^\*\*-\s+\*\*/, '- **') + '**';
            }

            if (/^\*\*:\s*/.test(trimmed)) {
                return trimmed.replace(/^\*\*:\s*/, '');
            }

            if (/^\*\*-\s*/.test(trimmed) && !/\*\*.*\*\*/.test(trimmed.slice(2))) {
                return trimmed.replace(/^\*\*-\s*/, '- ');
            }

            if (/^\*\*\s*\(/.test(trimmed) && !/\*\*.*\*\*/.test(trimmed.slice(2))) {
                return trimmed.replace(/^\*\*\s*/, '');
            }

            if (/^\*\*[^*]+$/.test(trimmed)) {
                return trimmed.replace(/^\*\*/, '');
            }

            return line;
        })
        .join('\n');

    // Add paragraph spacing before section headings
    fixed = fixed.replace(/([^\n])\n(\*\*[^*\n]+?\*\*)/g, '$1\n\n$2');

    // Ensure a blank line after bold heading-like lines before the next block
    fixed = fixed.replace(/(\*\*[^*\n]+?\*\*)\n(?=\S)/g, '$1\n\n');

    // Compress overly large gaps back down
    fixed = fixed.replace(/\n{3,}/g, '\n\n');
    
    return fixed;
};