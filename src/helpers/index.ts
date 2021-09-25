import { OpenSeaAsset, Nft } from "../types";

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
  return allNfts;
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
          // if (!c.name?.toLowerCase().includes("lunar")) {
          //   return a;
          // }
          // console.log(c);
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
            };
            a.push(nft);
          }
          return a;
        }, [] as Array<Nft>),
        received: assets.length,
      };
    });
};
