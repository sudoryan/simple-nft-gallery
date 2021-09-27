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
  const [toggle, setToggle] = React.useState(false);
  const [showToggle, setShowToggle] = React.useState(true);
  const timeoutRef = React.useRef(null);

  const handleToggleClick = () => {
    setShowToggle(false);
    setToggle(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowToggle(false);
    }, 10000);
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
    (timeoutRef as any).current = setTimeout(() => {
      if (!toggle) {
        setIndex((prevIndex) =>
          prevIndex === nfts.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 60 * 1000 * 5);

    return () => {
      resetTimeout();
    };
  }, [index, nfts, toggle]);

  return (
    <div className="App">
      {showToggle ? (
        <button onClick={handleToggleClick}>
          Show only matt.crypto Toggle
        </button>
      ) : null}
      <div className="slideshow">
        <div
          className="slideshowSlider"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {toggle && nfts.length ? (
            <div className="slide" key={index}>
              <NftCard nft={nfts.find((v) => v.name === "matt.crypto")!} />
            </div>
          ) : (
            nfts.map((nft, index) => (
              <div className="slide" key={index}>
                <NftCard nft={nft} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
