(function (root) {
  "use strict";

  root.OmniWarehouse = root.OmniWarehouse || {};
  root.OmniWarehouse.Config = Object.freeze({
    companyCode: 1,
    dataSource: "mock",
    locationTable: "TGFLOC",
    stockTable: "TGFEST",
    productTable: "TGFPRO"
  });
})(window);
