import React from 'react';

function SearchResult(props: { title: string, hashes: string }): JSX.Element {
  return (
    <option value={props.hashes} >{props.title}</option>
  );
}

export { SearchResult };