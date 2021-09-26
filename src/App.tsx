import React, { useEffect, useState } from "react";
import "./App.css";
import { getAllNfts } from "./helpers";
import { Nft } from "./types";
import NftCard from "./components/NftCard";

const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

function App() {
  const [nfts, setNfts] = useState([] as Nft[]);
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);

  useEffect(() => {
    getAllNfts("0xa59c818ddb801f1253edebf0cf08c9e481ea2fe5").then((results) =>
      setNfts(shuffle(results))
    );
  }, []);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();
    (timeoutRef as any).current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === nfts.length - 1 ? 0 : prevIndex + 1
        ),
      6000
    );

    return () => {
      resetTimeout();
    };
  }, [index, nfts]);

  return (
    <div className="App">
      <div className="slideshow">
        <div
          className="slideshowSlider"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {nfts.map((nft, index) => (
            <div className="slide" key={index}>
              <NftCard nft={nft} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
