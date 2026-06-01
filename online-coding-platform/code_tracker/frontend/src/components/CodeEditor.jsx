import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play } from 'lucide-react';
import './CodeEditor.css';

const CodeEditor = ({ language = "java", defaultCode = "", onSubmit, loading }) => {
    const [code, setCode] = useState(defaultCode);
    const [selectedLanguage, setSelectedLanguage] = useState(language);

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const handleSubmit = () => {
        onSubmit(code, selectedLanguage);
    };

    return (
        <div className="editor-container">
            <div className="editor-toolbar">
                <select
                    className="form-control language-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                </select>

                <button
                    className="btn btn-primary submit-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Evaluating..." : <><Play size={16} /> Submit Code</>}
                </button>
            </div>

            <div className="editor-wrapper">
                <Editor
                    height="100%"
                    width="100%"
                    language={selectedLanguage}
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16 }
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
