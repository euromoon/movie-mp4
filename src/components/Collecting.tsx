import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import './Collecting.css';

function Collecting(props: { isActive: boolean, currentFile: number, totalFiles: number }): JSX.Element {
  if (props.isActive) {
    return (
      <div>
        <h1>Collecting Metadata [{props.currentFile}/{props.totalFiles}] <FontAwesomeIcon icon={faCog} spin /></h1>
        <p>(This can take up to { props.totalFiles } minutes)</p>
      </div>
    );
  }
  return <></>;
}

export { Collecting };