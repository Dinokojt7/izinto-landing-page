// src/lib/utils/serviceModels.js
export class NewSpecialtyModel {
  constructor(data) {
    this.id = data?.id || this.generateFallbackId(data);
    this.name = data?.name || 'Unknown Item';
    this.introduction = data?.introduction || 'No description available';
    this.price = this.safeParsePriceList(data?.price);
    this.size = this.safeParseSizeList(data?.size);
    this.img = data?.img || '/images/placeholder.png';
    this.details = data?.details || [];
    this.type = data?.type || 'General';
    this.material = data?.material || 'Standard';
    this.provider = data?.provider || 'Unknown Provider';
    this.time = data?.time || '';
    this.selectedSize = data?.selectedSize || '';
    this.originalId = data?.originalId || this.id;
    this.isSizeVariant = data?.isSizeVariant || false;
  }

  safeParsePriceList(priceData) {
    try {
      if (Array.isArray(priceData)) {
        const result = [];
        for (let item of priceData) {
          const parsed = parseInt(item);
          if (!isNaN(parsed)) {
            result.push(parsed);
          }
        }
        return result.length > 0 ? result : [0];
      }
      return [0];
    } catch (e) {
      return [0];
    }
  }

  safeParseSizeList(sizeData) {
    try {
      if (Array.isArray(sizeData)) {
        return sizeData.map(item => item.toString());
      }
      return ['Standard'];
    } catch (e) {
      return ['Standard'];
    }
  }

  generateFallbackId(data) {
    return Math.abs(JSON.stringify(data).hashCode()) % 1000000;
  }

  get displayName() {
    if (this.isSizeVariant && this.selectedSize) {
      return `${this.name} (${this.selectedSize})`;
    }
    return this.name;
  }

  get actualPrice() {
    try {
      if (this.selectedSize && this.size && this.price) {
        const sizeIndex = this.size.indexOf(this.selectedSize);
        if (sizeIndex !== -1 && sizeIndex < this.price.length) {
          return this.price[sizeIndex];
        }
      }
      return this.firstPrice;
    } catch (e) {
      return this.firstPrice;
    }
  }

  get firstPrice() {
    return this.price && this.price.length > 0 ? this.price[0] : 0;
  }
}

// Add hashCode method to String prototype for fallback ID generation
String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};