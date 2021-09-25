import "./NftCard.css";
import { Nft } from "../types";
import { useEffect, useState } from "react";

interface Props {
  nft: Nft;
}

const NftCard = ({ nft }: Props) => {
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    const element = document.getElementById(nft.name);
    if (element) {
      element.addEventListener(
        "error",
        () => {
          setShowVideo(false);
        },
        true
      );
    }
  }, [nft]);

  const handleClick = () => {
    window.open(nft.link, "_blank");
  };

  const renderDescription = () => {
    if (nft.description.length > 340) {
      return nft.description.substring(0, 340) + " ...";
    }
    return nft.description;
  };

  const shouldRenderVideo = () => {
    if (nft.video_url) {
      if (
        !nft.video_url.endsWith(".gif") &&
        !nft.video_url.endsWith(".gltf") &&
        !nft.video_url.endsWith(".glb") &&
        !nft.video_url.endsWith(".mp3")
      ) {
        return true;
      }
    }
    // For case when image_url incorrectly provides video file
    if (nft.image_url && nft.image_url.endsWith(".mp4")) {
      return true;
    }
    return false;
  };
  return (
    <div className="NFT-container">
      <div className="NFT-image-container">
        {showVideo && shouldRenderVideo() ? (
          <video
            id={nft.name}
            onClick={handleClick}
            muted
            playsInline
            autoPlay
            controlsList="nodownload"
            loop
            preload="auto"
            src={nft.video_url || nft.image_url}
            className="NFT-image"
          />
        ) : (
          <img
            src={nft.image_url}
            className="NFT-image"
            onClick={handleClick}
            alt={nft.name}
          />
        )}
      </div>
      <div className="NFT-infoContainer">
        <div className="NFT-name" onClick={handleClick}>
          {nft.name}
        </div>
        <div className="NFT-description">
          {nft.description ? renderDescription() : null}
        </div>
      </div>
    </div>
  );
};

export default NftCard;
