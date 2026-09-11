(function (root) {
  "use strict";

  function validateMovement(source, destination, quantity) {
    const amount = Number(quantity);
    if (!source || !destination || !source.produto || amount <= 0 || amount > source.qtd) {
      throw new Error("Informe uma quantidade válida e escolha um destino livre.");
    }
    if (destination.ocupacao > 0) throw new Error("O local de destino não está livre.");
    return amount;
  }

  function transferProduct(source, destination, quantity) {
    const amount = validateMovement(source, destination, quantity);
    destination.produto = source.produto;
    destination.qtd = amount;
    destination.ocupacao = Math.min(100, Math.max(1, Math.round(amount / 1.5)));
    source.qtd -= amount;
    source.ocupacao = source.qtd === 0 ? 0 : Math.min(100, Math.max(1, Math.round(source.qtd / 1.5)));
    return { source, destination };
  }

  function createStorageTask(tasks, source, destination, quantity) {
    const amount = validateMovement(source, destination, quantity);
    const task = {
      id: tasks.length + 1,
      produto: source.produto.name,
      quantidade: amount,
      origem: source.codlocal,
      destino: destination.codlocal,
      status: "PENDENTE"
    };
    tasks.push(task);
    return task;
  }

  root.OmniWarehouse = root.OmniWarehouse || {};
  root.OmniWarehouse.Application = { transferProduct, createStorageTask };
})(window);
