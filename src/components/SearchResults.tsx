import React from 'react';
import { randomBytes } from 'crypto';
import { SearchResult } from './SearchResult';
import './SearchResults.css';

function SearchResults(props: { results: { title: string, hash: string, peers: number }[], onSelected: (hash: string) => void }): JSX.Element
{
  return (
    <select onChange={ (event) => props.onSelected(event.target.value) }>
      <option>Selecionar</option>
      {props.results.map(result => <SearchResult key={randomBytes(8).toString('hex')} title={result.title} hash={result.hash} peers={result.peers} />)}
    </select>
  );
}

export { SearchResults };