import { apiRequest } from "./api";

export function getGarden() {
  return apiRequest("/garden");
}

export function plantSeed(tileId, seedId) {
  return apiRequest("/garden/plant", {
    method: "POST",
    body: JSON.stringify({ tileId, seedId }),
  });
}

export function harvestCrop(tileId) {
  return apiRequest("/garden/harvest", {
    method: "POST",
    body: JSON.stringify({ tileId }),
  });
}

export function removeCrop(tileId) {
  return apiRequest("/garden/remove", {
    method: "POST",
    body: JSON.stringify({ tileId }),
  });
}
