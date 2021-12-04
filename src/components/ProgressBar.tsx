import React, { CSSProperties } from 'react';
import './ProgressBar.css';

function ProgressBar(props: { progress: string, downloadSpeed: string, fileSize: string }): JSX.Element {
  let foregroundStyle: CSSProperties = 
  {
    top: '0',
    left: '0',
    position: 'absolute',
    width: `${props.progress}%`,
    height: '100%',
    background: 'hsl(120, 75%, 65%)',
    borderRadius: '1em 0 0 1em',
    zIndex: '1'
  };
  return (
    <>
      <div className="progress-background" >
        <div style={foregroundStyle} />
        <h1 className="title" >{props.progress}%</h1>
      </div>
      <h3>Download Speed: {props.downloadSpeed}Mb/s<br/>Total: { props.fileSize }Mb</h3>
    </>
  );
}

export { ProgressBar };