import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

function Collecting(props: { isActive: boolean }): JSX.Element {
  if (props.isActive) {
    return <div>Collecting Metadata <FontAwesomeIcon icon={faCog} spin /> </div>;
  }
  return <></>;
}

export { Collecting };