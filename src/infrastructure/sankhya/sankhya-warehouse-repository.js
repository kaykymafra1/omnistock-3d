(function (root) {
  "use strict";

  async function executeQuery(sql) {
    if (typeof root.JX === "undefined" || typeof root.JX.consultar !== "function") {
      throw new Error("Runtime Sankhya/JX indisponível. Utilize o repositório mock no desenvolvimento.");
    }
    return root.JX.consultar(sql);
  }

  async function listLocations(companyCode) {
    const code = Number(companyCode);
    if (!Number.isInteger(code) || code <= 0) throw new Error("Código da empresa inválido.");
    return executeQuery(`
      SELECT LOC.CODLOCAL,
             LOC.DESCRLOCAL,
             LOC.ANALITICO
        FROM TGFLOC LOC
       WHERE LOC.CODEMP = ${code}
       ORDER BY LOC.CODLOCAL
    `);
  }

  root.OmniWarehouse = root.OmniWarehouse || {};
  root.OmniWarehouse.SankhyaWarehouseRepository = { listLocations };
})(window);
