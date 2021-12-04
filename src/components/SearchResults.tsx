import React from 'react';
import { randomBytes } from 'crypto';
import { SearchResult } from './SearchResult';
import './SearchResults.css';

function SearchResults(props: { placeholder: string, results: { title: string, hashes: string }[], onSelected: (hash: string) => void }): JSX.Element
{
  return (
    <select onChange={ (event) => { if (event.target.value) props.onSelected(event.target.value); } }>
      { props.placeholder === '' ? <option /> : <option>{ props.placeholder }</option> }
      { props.results.map(result => <SearchResult key={randomBytes(8).toString('hex')} title={result.title} hashes={result.hashes} />) }
    </select>
  );
}

export { SearchResults };