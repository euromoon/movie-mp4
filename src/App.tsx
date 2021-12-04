import { useEffect, useState } from 'react';
import React from 'react';
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
import WebTorrent from 'webtorrent';
import './App.css';

function App(): JSX.Element {
  let client = new WebTorrent();
  let [torrentFiles, setTorrentFiles] = useState(new Array<JSX.Element>());
  let [queryTerm, setQueryTerm] = useState('');
  let [progress, setProgress] = useState('0');
  let [downloadSpeed, setDownloadSpeed] = useState('0');
  let [collectingMetadata, setCollectingMetadata] = useState({ isCollecting: false, currentFile: 0, totalFiles: 0 });
  let [fileSize, setFileSize] = useState('0');
  let [results, setResults] = useState(new Array<{ title: string, hashes: string }>());
  let [placeholder, setPlaceholder] = useState('');
  let progressBar = <ProgressBar progress={progress} downloadSpeed={downloadSpeed} fileSize={fileSize} />;
  let resultsElement = <SearchResults results={results} onSelected={startDownloadingTorrent} placeholder={placeholder} />;

  function onTypedSearch(): void {
    axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${queryTerm}`)
      .then(response => {
        if (response.data.data.movie_count === 0)
        {
          setPlaceholder('No results found');
          return;
        }
        setPlaceholder('Select an option');
        let newResults = new Array<{ title: string, hashes: string }>();
        response.data.data.movies.forEach((movie: any): void => {
          let hashes = movie.torrents
            .sort(({ seedsA }: { seedsA: number }, { seedsB }: { seedsB: number}): number => { return seedsB - seedsA; })
            .map(({ hash }: { hash: string }) => hash).join('+');
          newResults.push({ title: movie.title_long, hashes });
        });
        setResults(newResults);
      }).catch(console.log);
  }

  function startDownloadingTorrent(hashes: string): void {
    let hashArray = hashes.split('+');
    let timeoutID = setTimeout(() => {
      client.remove(hashArray[0]);
      hashArray.shift();
      if (hashArray.length > 0) {
        startDownloadingTorrent(hashArray.join('+'));
        return;
      }
      alert('Sorry, but the download failed for the desired movie');
    }, 60 * 1000);
    let torrent = client.add(hashArray[0], { announce: Trackers, maxWebConns: -1 });
    torrent.on('infoHash', () => {
      console.log(collectingMetadata);
      let totalFiles = collectingMetadata.totalFiles === 0 ? hashArray.length : collectingMetadata.totalFiles;
      let currentFile = collectingMetadata.currentFile + 1;
      setCollectingMetadata({ isCollecting: true, currentFile, totalFiles });
    });
    torrent.on('ready', () => {
      console.log('Ready!');
      clearTimeout(timeoutID);
      setCollectingMetadata({ isCollecting: false, currentFile: 0, totalFiles: 0 });
      let mp4Files = torrent.files.filter(file => file.name.endsWith('.mp4'));
      if (mp4Files.length === 0) {
        alert('No MP4 files were found for the desired movie');
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
          if (url) {
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
        <input type="text" value={queryTerm} onChange={(event) => setQueryTerm(event.target.value)} />
        <button onClick={onTypedSearch}>Search</button>
      </div>
      {resultsElement}
      <Collecting isActive={collectingMetadata.isCollecting} currentFile={collectingMetadata.currentFile} totalFiles={collectingMetadata.totalFiles} />
      <div className="TorrentFiles" >
        {torrentFiles}
      </div>
      {progressBar}
    </div>
  );
}

export default App;
