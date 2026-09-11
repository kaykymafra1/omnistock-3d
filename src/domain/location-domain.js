(function (root) {
  "use strict";

  const STATUS = Object.freeze({ FREE: "LIVRE", PARTIAL: "PARCIAL", FULL: "CHEIO" });

  function statusFromOccupancy(occupancy) {
    const value = Number(occupancy) || 0;
    if (value <= 0) return STATUS.FREE;
    if (value >= 100) return STATUS.FULL;
    return STATUS.PARTIAL;
  }

  function normalizeLocation(location) {
    location.ocupacao = Math.max(0, Math.min(100, Number(location.ocupacao) || 0));
    location.qtd = Math.max(0, Math.floor(Number(location.qtd) || 0));
    location.status = statusFromOccupancy(location.ocupacao);
    if (location.status === STATUS.FREE) {
      location.produto = null;
      location.qtd = 0;
    }
    return location;
  }

  root.OmniWarehouse = root.OmniWarehouse || {};
  root.OmniWarehouse.Domain = { STATUS, statusFromOccupancy, normalizeLocation };
})(window);
