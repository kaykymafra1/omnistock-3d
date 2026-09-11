import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

async function loadModules() {
  const context = { window: {}, console };
  vm.createContext(context);
  for (const file of ["src/domain/location-domain.js", "src/application/warehouse-operations.js"]) {
    vm.runInContext(await readFile(file, "utf8"), context, { filename: file });
  }
  return context.window.OmniWarehouse;
}

test("normaliza ocupacao, quantidade e produto de uma localizacao livre", async () => {
  const { Domain } = await loadModules();
  const location = { ocupacao: 120, qtd: 3.9, produto: { name: "Produto" } };

  Domain.normalizeLocation(location);

  assert.equal(location.ocupacao, 100);
  assert.equal(location.qtd, 3);
  assert.equal(location.status, Domain.STATUS.FULL);
});

test("limpa produto e quantidade quando a localizacao fica livre", async () => {
  const { Domain } = await loadModules();
  const location = { ocupacao: 0, qtd: 10, produto: { name: "Produto" } };

  Domain.normalizeLocation(location);

  assert.equal(location.status, Domain.STATUS.FREE);
  assert.equal(location.qtd, 0);
  assert.equal(location.produto, null);
});

test("transfere uma quantidade inteira para um destino livre", async () => {
  const { Application } = await loadModules();
  const source = { codlocal: "1", produto: { name: "Racao" }, qtd: 10, ocupacao: 80 };
  const destination = { codlocal: "2", produto: null, qtd: 0, ocupacao: 0 };

  const result = Application.transferProduct(source, destination, 4);

  assert.equal(result.source, source);
  assert.equal(source.qtd, 6);
  assert.equal(destination.qtd, 4);
  assert.equal(destination.produto.name, "Racao");
});

test("rejeita quantidade decimal, NaN e destino ocupado", async () => {
  const { Application } = await loadModules();
  const source = { codlocal: "1", produto: { name: "Racao" }, qtd: 10, ocupacao: 80 };
  const destination = { codlocal: "2", produto: null, qtd: 0, ocupacao: 0 };
  const occupied = { codlocal: "3", produto: { name: "Outro" }, qtd: 2, ocupacao: 20 };

  for (const quantity of [1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => Application.transferProduct(source, destination, quantity), /quantidade v.lida/i);
  }
  assert.throws(() => Application.transferProduct(source, occupied, 1), /destino n.o est. livre/i);
});

test("cria tarefa de armazenagem com identificador incremental", async () => {
  const { Application } = await loadModules();
  const tasks = [];
  const source = { codlocal: "1", produto: { name: "Racao" }, qtd: 10, ocupacao: 80 };
  const destination = { codlocal: "2", produto: null, qtd: 0, ocupacao: 0 };

  const task = Application.createStorageTask(tasks, source, destination, 3);

  assert.equal(JSON.stringify(task), JSON.stringify({ id: 1, produto: "Racao", quantidade: 3, origem: "1", destino: "2", status: "PENDENTE" }));
  assert.equal(tasks.length, 1);
});