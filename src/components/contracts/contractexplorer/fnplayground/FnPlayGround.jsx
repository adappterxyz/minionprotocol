import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

const FnPlayGround = ({ chainid,chainAddress,language}) => {
  const [lineNumbers, setLineNumbers] = useState('1');
  const lineNumberRef = useRef(null);

  const handleCodeSnippetChange = (event) => {
 
  };
// to add chatgpt to leditor at some point
 


  return (
   <div>
    Function playground
    </div>
  );
};

export default FnPlayGround;
