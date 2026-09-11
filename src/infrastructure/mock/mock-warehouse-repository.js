(function (root) {
  "use strict";

  const products = Object.freeze([
    { cod: "882", name: "Ração 15kg" },
    { cod: "991", name: "Antipulgas" },
    { cod: "445", name: "Tapete Higiênico" }
  ]);

  function listProducts() {
    return products.map(product => ({ ...product }));
  }

  root.OmniWarehouse = root.OmniWarehouse || {};
  root.OmniWarehouse.MockWarehouseRepository = { listProducts };
})(window);
