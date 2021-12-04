import React from 'react';

function SearchResult(props: { title: string, hash: string, peers: number }): JSX.Element {
  return (
    <option value={props.hash} >{ props.title }</option>
  );
}

export { SearchResult };