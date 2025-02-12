type TokenType = 'keyword' | 'function' | 'comment' | 'string' | 'number' | 'operator' | 'variable' | 'whitespace';

interface Token {
  value: string;
  type: TokenType;
}

export function parseCode(code: string): Token[][] {
  const syntax: { [key: string]: TokenType } = {
    '\\b(function|return|let|const|var|if|else|for|while|do|switch|case|break|continue|async|await)\\b': 'keyword',
    '\\b([A-Za-z_$][A-Za-z0-9_$]*)\\s*(?=\\()': 'function',
    '//.*$': 'comment',
    '/\\*[\\s\\S]*?\\*/': 'comment',
    '"(?:[^"\\\\]|\\\\.)*"': 'string',
    "'(?:[^'\\\\]|\\\\.)*'": 'string',
    '\\b\\d+\\.?\\d*\\b': 'number',
    '[+\\-*/%=<>!&|^~?:]+': 'operator',
    '\\b(true|false|null|undefined)\\b': 'keyword'
  };

  return code.split('\n').map(line => {
    const tokens: Token[] = [];
    let remaining = line;

    while (remaining.length > 0) {
      let matchFound = false;

      // Match whitespace first
      const whitespaceMatch = remaining.match(/^(\s+)/);
      if (whitespaceMatch) {
        tokens.push({ value: whitespaceMatch[0], type: 'whitespace' });
        remaining = remaining.slice(whitespaceMatch[0].length);
        continue;
      }

      for (const [pattern, type] of Object.entries(syntax)) {
        const regex = new RegExp(`^${pattern}`);
        const match = remaining.match(regex);
        
        if (match) {
          const value = match[0];
          tokens.push({ value, type });
          remaining = remaining.slice(value.length);
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        const textMatch = remaining.match(/^\S+/);
        if (textMatch) {
          tokens.push({ value: textMatch[0], type: 'variable' });
          remaining = remaining.slice(textMatch[0].length);
        } else {
          remaining = '';
        }
      }
    }

    return tokens;
  });
} 