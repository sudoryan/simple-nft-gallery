import { OpenSeaAsset, Nft } from "../types";

const SHOW_ONE = [
  {
    name: "N",
    address: "0x05a46f1e545526fb803ff974c790acea34d1f2d6",
  },
];

const SHOW_NONE = [
  {
    name: "Pudgy Present",
    address: "0x062e691c2054de82f28008a8ccc6d7a1c8ce060d",
  },
];

export const cleanNftList = (nfts: Array<Nft>): Array<Nft> => {
  for (const item of SHOW_NONE) {
    nfts = nfts.filter((nft) => nft.contract_address !== item.address);
  }
  for (const item of SHOW_ONE) {
    let found = false;

    nfts = nfts.filter((nft) => {
      if (nft.contract_address !== item.address) {
        return true;
      }
      if (!found) {
        found = true;
        return true;
      }
      return false;
    });
  }
  return nfts;
};

export const getAllNfts = async (ownerAddress: string) => {
  const allNfts = [];
  let offset = 0;
  while (true) {
    const { nfts, received } = await getNfts(ownerAddress, offset, 20);
    if (received === 0) {
      break;
    }
    allNfts.push(...nfts);
    offset++;
  }
  return cleanNftList(allNfts);
};

export const getNfts = async (
  ownerAddress: string,
  offset: number,
  limit: number
): Promise<{ nfts: Array<Nft>; received: number }> => {
  return fetch(
    `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${
      offset * limit
    }&limit=${limit}&owner=${ownerAddress}`,
    {
      method: "GET",
    }
  )
    .then((resp) => resp.json())
    .then(({ assets }: { assets: OpenSeaAsset[] }) => {
      return {
        nfts: assets.reduce((a, c: OpenSeaAsset) => {
          if ((c.name || c.token_id) && c.image_url) {
            const nft: Nft = {
              link: c.permalink,
              name: c.name || c.token_id,
              image_url: c.image_url,
              description: c.description || "",
              video_url: c.animation_url || "",
              creator: {
                username:
                  c.creator?.user?.username || c.creator?.address || "Unknown",
                profile_img: c.creator?.profile_img_url || "",
              },
              contract_address: c.asset_contract.address,
            };
            a.push(nft);
          }
          return a;
        }, [] as Array<Nft>),
        received: assets.length,
      };
    });
};
