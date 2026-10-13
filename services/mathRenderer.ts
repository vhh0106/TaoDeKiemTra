import katex from 'katex';

/**
 * Clean up and convert common LaTeX tokens to Word-friendly HTML.
 * Microsoft Word (.doc) doesn't load KaTeX fonts or CSS classes,
 * so we convert math into standard HTML table/spans/Unicode for Word.
 */
export function convertLatexToWordHtml(latex: string): string {
  let res = latex.trim();

  // Strip enclosing $ or $$ or \[ \] or \( \)
  if (res.startsWith('$$') && res.endsWith('$$')) {
    res = res.slice(2, -2).trim();
  } else if (res.startsWith('$') && res.endsWith('$')) {
    res = res.slice(1, -1).trim();
  } else if (res.startsWith('\\[') && res.endsWith('\\]')) {
    res = res.slice(2, -2).trim();
  } else if (res.startsWith('\\(') && res.endsWith('\\)')) {
    res = res.slice(2, -2).trim();
  }

  // Common symbols replacements
  res = res
    .replace(/\\times/g, ' × ')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\div/g, ' : ')
    .replace(/\\pm/g, ' ± ')
    .replace(/\\mp/g, ' ∓ ')
    .replace(/\\le(q)?\b/g, ' ≤ ')
    .replace(/\\ge(q)?\b/g, ' ≥ ')
    .replace(/\\ne(q)?\b/g, ' ≠ ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\equiv/g, ' ≡ ')
    .replace(/\\in\b/g, ' ∈ ')
    .replace(/\\notin\b/g, ' ∉ ')
    .replace(/\\subset\b/g, ' ⊂ ')
    .replace(/\\subseteq\b/g, ' ⊆ ')
    .replace(/\\cap\b/g, ' ∩ ')
    .replace(/\\cup\b/g, ' ∪ ')
    .replace(/\\emptyset\b/g, ' ∅ ')
    .replace(/\\infty\b/g, ' ∞ ')
    .replace(/\\pi\b/g, 'π')
    .replace(/\\alpha\b/g, 'α')
    .replace(/\\beta\b/g, 'β')
    .replace(/\\gamma\b/g, 'γ')
    .replace(/\\Delta\b/g, 'Δ')
    .replace(/\\theta\b/g, 'θ')
    .replace(/\\lambda\b/g, 'λ')
    .replace(/\\mu\b/g, 'μ')
    .replace(/\\sigma\b/g, 'σ')
    .replace(/\\omega\b/g, 'ω')
    .replace(/\\Omega\b/g, 'Ω')
    .replace(/\\circ\b/g, '°')
    .replace(/\\degree\b/g, '°')
    .replace(/\^\{\\circ\}/g, '°')
    .replace(/\^\\circ/g, '°')
    .replace(/\\vec\{([a-zA-Z0-9]+)\}/g, '⃗$1')
    .replace(/\\overrightarrow\{([a-zA-Z0-9]+)\}/g, '→$1')
    .replace(/\\widehat\{([a-zA-Z0-9]+)\}/g, '∠$1')
    .replace(/\\angle\s*([a-zA-Z0-9]+)/g, '∠$1')
    .replace(/\\parallel/g, ' // ')
    .replace(/\\perp/g, ' ⊥ ');

  // Handle fractions: \frac{a}{b} -> vertical fraction table/span in Word
  res = res.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_match, num, den) => {
    return `<span style="display:inline-block; vertical-align:middle; text-align:center; margin:0 2px; font-family:'Cambria Math','Times New Roman',serif;"><span style="display:block; border-bottom:1px solid #000; padding:0 3px; font-size:10pt; line-height:1.2;">${num}</span><span style="display:block; padding:0 3px; font-size:10pt; line-height:1.2;">${den}</span></span>`;
  });

  // Handle square root: \sqrt{x} or \sqrt[n]{x}
  res = res.replace(/\\sqrt\[([^{}]+)\]\{([^{}]+)\}/g, '<sup>$1</sup>√<span style="border-top:1px solid #000; padding-top:1px;">$2</span>');
  res = res.replace(/\\sqrt\{([^{}]+)\}/g, '√<span style="border-top:1px solid #000; padding-top:1px;">$1</span>');

  // Handle superscripts & subscripts: ^{abc} -> <sup>abc</sup>, _{abc} -> <sub>abc</sub>
  res = res.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>');
  res = res.replace(/\^([0-9a-zA-Z])/g, '<sup>$1</sup>');
  res = res.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>');
  res = res.replace(/_([0-9a-zA-Z])/g, '<sub>$1</sub>');

  // Clean remaining braces and text commands
  res = res.replace(/\\text\{([^{}]+)\}/g, '$1');
  res = res.replace(/\\mathrm\{([^{}]+)\}/g, '$1');
  res = res.replace(/\\mathbf\{([^{}]+)\}/g, '<b>$1</b>');
  res = res.replace(/\\mathit\{([^{}]+)\}/g, '<i>$1</i>');
  res = res.replace(/\\left[\[\(\{\|]/g, '');
  res = res.replace(/\\right[\]\)\}\|]/g, '');
  res = res.replace(/\\,/g, ' ');
  res = res.replace(/\\;/g, ' ');
  res = res.replace(/\\!/g, '');

  return `<span style="font-family:'Cambria Math','Times New Roman',serif; font-style:italic;">${res}</span>`;
}

/**
 * Safely render a LaTeX formula into HTML using KaTeX.
 * If KaTeX fails to parse, falls back to a clean readable representation.
 */
export function renderLatexFormula(latex: string, displayMode = false): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });
  } catch (_e) {
    // Fallback if parsing fails
    return convertLatexToWordHtml(latex);
  }
}

/**
 * Parse any text containing LaTeX math patterns and return an HTML string with rendered formulas.
 * Supports:
 * - $$ ... $$ (display math)
 * - \[ ... \] (display math)
 * - $ ... $ (inline math)
 * - \( ... \) (inline math)
 */
export function renderMathInHtml(rawText: string): string {
  if (!rawText) return '';

  let processed = rawText;

  // 1. Process block math $$ ... $$
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (_match, formula) => {
    return `<div class="katex-block-wrapper my-2 py-1 text-center overflow-x-auto">${renderLatexFormula(formula, true)}</div>`;
  });

  // 2. Process block math \[ ... \]
  processed = processed.replace(/\\\[([\s\S]+?)\\\]/g, (_match, formula) => {
    return `<div class="katex-block-wrapper my-2 py-1 text-center overflow-x-auto">${renderLatexFormula(formula, true)}</div>`;
  });

  // 3. Process inline math \( ... \)
  processed = processed.replace(/\\\(([\s\S]+?)\\\)/g, (_match, formula) => {
    return `<span class="katex-inline-wrapper mx-0.5 inline-block align-middle">${renderLatexFormula(formula, false)}</span>`;
  });

  // 4. Process inline math $ ... $ (avoid matching single dollar signs with currency like $50 or $ 50)
  processed = processed.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (_match, prefix, formula) => {
    // Only treat as math if it has non-whitespace inside and doesn't look like currency
    const trimmed = formula.trim();
    if (!trimmed || /^\d+(\s*USD|\s*VND|\s*dollars?|\s*đồng)?$/i.test(trimmed)) {
      return `${prefix}$${formula}$`;
    }
    return `${prefix}<span class="katex-inline-wrapper mx-0.5 inline-block align-middle">${renderLatexFormula(trimmed, false)}</span>`;
  });

  // 5. Catch standalone common LaTeX fraction commands that AI sometimes writes without $ delimiter
  processed = processed.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (match) => {
    return `<span class="katex-inline-wrapper mx-0.5 inline-block align-middle">${renderLatexFormula(match, false)}</span>`;
  });

  // 6. Catch standalone square root without $ delimiter
  processed = processed.replace(/\\sqrt\{([^{}]+)\}/g, (match) => {
    return `<span class="katex-inline-wrapper mx-0.5 inline-block align-middle">${renderLatexFormula(match, false)}</span>`;
  });

  return processed;
}

/**
 * Process text for Microsoft Word export so math formulas look beautiful
 * when opened in MS Word (.doc).
 */
export function renderMathForWordExport(rawText: string): string {
  if (!rawText) return '';

  let processed = rawText;

  // Replace $$ ... $$
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (_match, formula) => {
    return `<div style="text-align:center; margin:8px 0;">${convertLatexToWordHtml(formula)}</div>`;
  });

  // Replace \[ ... \]
  processed = processed.replace(/\\\[([\s\S]+?)\\\]/g, (_match, formula) => {
    return `<div style="text-align:center; margin:8px 0;">${convertLatexToWordHtml(formula)}</div>`;
  });

  // Replace \( ... \)
  processed = processed.replace(/\\\(([\s\S]+?)\\\)/g, (_match, formula) => {
    return convertLatexToWordHtml(formula);
  });

  // Replace $ ... $
  processed = processed.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (_match, prefix, formula) => {
    const trimmed = formula.trim();
    if (!trimmed || /^\d+(\s*USD|\s*VND|\s*dollars?|\s*đồng)?$/i.test(trimmed)) {
      return `${prefix}$${formula}$`;
    }
    return `${prefix}${convertLatexToWordHtml(trimmed)}`;
  });

  // Standalone \frac and \sqrt
  processed = processed.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (match) => {
    return convertLatexToWordHtml(match);
  });
  processed = processed.replace(/\\sqrt\{([^{}]+)\}/g, (match) => {
    return convertLatexToWordHtml(match);
  });

  return processed;
}
