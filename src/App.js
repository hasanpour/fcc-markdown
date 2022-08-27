import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { setConfig, sanitize } from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import './App.css';

const initialText = `\
# Welcome to my React Markdown Previewer!
This project is part of **"Front End Development Libraries Course"** \
at [Free Code Camp](https://www.freecodecamp.org).

## How to insert code?

Heres is an inline code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

> There is no failure except in no longer trying.

Here is a table:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- [My github account](https://github.com/hasanpour)
  - [My CodePen account](https://codepen.io/hasanpour)

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)\
`;

export default function App() {
  const [markdownText, setMarkdownText] = useState(initialText);
  const [previewText, setPreviewText] = useState({ __html: '' });

  // Alow target=_blank on "a" tags.
  setConfig({ ADD_ATTR: ['target'] });

  // Customize marked renderer.
  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) => `<a target="_blank" href="${href}">${text}</a>`;
  renderer.codespan = (code) => `<code class="hljs">${code}</code>`;
  renderer.code = (code) => {
    const highlightedCode = hljs.highlightAuto(code).value;
    return `<pre><code class="hljs">${highlightedCode}</code></pre>`;
  };

  // Highlight code and render carriage return.
  marked.setOptions({
    renderer,
    breaks: true,
    smartLists: true,
  });

  // Sanitizes HTML to prevent XSS attacks.
  const createMarkup = (text) => ({ __html: sanitize(marked.parse(text)) });

  const handleTextChange = (event) => {
    setMarkdownText(event.target.value);
    setPreviewText(createMarkup(event.target.value));
  };

  useEffect(() => {
    setPreviewText(createMarkup(initialText));
  }, []);

  return (
    <div className="wrapper">
      <div className="box">
        <h2 className="box_header">Markdown Text</h2>
        <div className="box_content">
          <textarea
            id="editor"
            placeholder="Type your markdown here..."
            value={markdownText}
            onChange={handleTextChange}
          />
        </div>
      </div>

      <div className="box">
        <h2 className="box_header">Preview</h2>
        <div className="box_content">
          {/* eslint-disable-next-line react/no-danger */}
          <div id="preview" dangerouslySetInnerHTML={previewText} />
        </div>
      </div>
    </div>
  );
}
