class Smartphone {
  constructor({ id, brand, model, price, storage }) {
    this.id = Number(id);
    this.brand = brand.trim();
    this.model = model.trim();
    this.price = Number(price);
    this.storage = storage.trim();
  }

  static create(data) {
    return new Smartphone(data);
  }

  static validate(data) {
    // Mantenimiento preventivo: estas validaciones evitan datos incompletos
    // o inconsistentes antes de que lleguen al almacenamiento en memoria.
    if (!data.brand || typeof data.brand !== 'string' || !data.brand.trim()) {
      return { isValid: false, message: 'La marca es obligatoria' };
    }

    if (!data.model || typeof data.model !== 'string' || !data.model.trim()) {
      return { isValid: false, message: 'El modelo es obligatorio' };
    }

    if (data.price === undefined || Number(data.price) <= 0) {
      return { isValid: false, message: 'El precio debe ser mayor a 0' };
    }

    if (
      !data.storage ||
      typeof data.storage !== 'string' ||
      !data.storage.trim()
    ) {
      return { isValid: false, message: 'El almacenamiento es obligatorio' };
    }

    return { isValid: true };
  }
}

module.exports = Smartphone;
