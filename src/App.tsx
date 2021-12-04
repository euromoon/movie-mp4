import { useState } from 'react';
import { randomBytes } from 'crypto';
import { ProgressBar } from './components/ProgressBar';
import { Collecting } from './components/Collecting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { MovieMP4Logo } from './components/MovieMP4Logo';
import { Trackers } from './Trackers';
import { SearchResults } from './components/SearchResults';
import Helmet from 'react-helmet';
import axios from 'axios';
import React from 'react';
import WebTorrent from 'webtorrent';
import './App.css';

function App(): JSX.Element
{  
  let client = new WebTorrent();
  let [torrentFiles, setTorrentFiles] = useState(new Array<JSX.Element>());
  let [queryTerm, setQueryTerm] = useState('');
  let [progress, setProgress] = useState('0');
  let [downloadSpeed, setDownloadSpeed] = useState('0');
  let [collectingMetadata, setCollectingMetadata] = useState(false);
  let [fileSize, setFileSize] = useState('0');
  let [results, setResults] = useState(new Array<{title: string, hash: string, peers: number}>());
  let progressBar = <ProgressBar progress={progress} downloadSpeed={downloadSpeed} fileSize={fileSize} />;
  let resultsElement = <SearchResults results={results} onSelected={startDownloadingTorrent} />; 

  function onTypedSearch(): void
  {
    axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${queryTerm}`)
      .then(response => {
        let newResults = new Array<{title: string, hash: string, peers: number}>();
        response.data.data.movies.forEach((movie: any): void => {
          console.log(movie);
          let desiredTorrent = movie.torrents.sort((a: any, b: any): number => { return b.peers - a.peers; })[0];
          newResults.push({title: movie.title_long, hash: desiredTorrent.hash, peers: desiredTorrent.peers});
        });
        setResults(newResults);
      }).catch(console.log);
  }

  function HashToMagnet(hash: string): string
  {
    let magnet = `magnet:?xt=urn:btih:${hash}`;
    Trackers.forEach(tracker => {
      magnet += `&tr=${tracker}`;
    });
    return magnet;
  }

  function startDownloadingTorrent(hash: string): void
  {
    let torrent = client.add(HashToMagnet(hash));
    console.log(torrent);
    torrent.on('infoHash', () => {
      setCollectingMetadata(true);
    });
    torrent.on('ready', () => {
      setCollectingMetadata(false);
      let mp4Files = torrent.files.filter(file => file.name.endsWith('.mp4'));
      if (mp4Files.length === 0)
      {
        alert('No MP4 files were found in torrent');
        torrent.destroy();
        return;
      }
      mp4Files.forEach(file => {
        setFileSize((file.length / 1000000).toFixed(2));
        setTorrentFiles([...torrentFiles,
          <p key={randomBytes(8).toString('hex')} ><b>Downloading:  </b>{file.name} <FontAwesomeIcon icon={faCog} spin /></p>]);
      });
    });
    torrent.on('error', console.log);
    torrent.on('warning', console.log);
    torrent.on('download', () => {
      setDownloadSpeed((torrent.downloadSpeed / 1000000).toFixed(2));
      setProgress((torrent.progress * 100).toFixed(2));
    });
    torrent.on('done', () => {
      torrent.files.filter(file => file.name.endsWith('.mp4')).forEach(file => {
        file.getBlobURL((err, url) => {
          if (err) throw err;
          if (url)
          {
            let a = document.createElement('a');
            a.download = file.name;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            a.remove();
          }
        });
      });
    });
  }

  return (
    <div className="App">
      <Helmet title="movie-mp4" />
      <MovieMP4Logo />
      <div className="SearchBox">
        <input type="text" value={queryTerm} onChange={ (event) => setQueryTerm(event.target.value) } />
        <button onClick={onTypedSearch}>Buscar</button>
      </div>
      { resultsElement }
      <Collecting isActive={ collectingMetadata } />
      <div className="TorrentFiles" >
        { torrentFiles }
      </div>
      { progressBar }
    </div>
  );
}

export default App;
