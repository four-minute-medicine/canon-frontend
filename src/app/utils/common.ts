
export const fixMarkdown = (content: string): string => {
    if (!content) return content;

    let fixed = content;

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

    //add two line breaks between the first '**' and the text before it
    fixed = fixed.replace(/^(.*?)\s*(\*\*)/, (_, before, stars) => `${before}\n\n${stars}`);
    
    return fixed;
};