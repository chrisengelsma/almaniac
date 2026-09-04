import { NativePurchases, PURCHASE_TYPE, type Product } from '@capgo/native-purchases';
import { TIP_PRODUCT_IDS } from '../data/tipProducts';
import { getDonationChannel } from '../theme/supportLinks';

export interface TipProduct {
  id: string;
  title: string;
  priceString: string;
}

export function isTipJarAvailable(): boolean {
  return getDonationChannel() === 'iap';
}

function sortTipProductList(products: TipProduct[]): TipProduct[] {
  const order = new Map<string, number>(TIP_PRODUCT_IDS.map((id, index) => [id, index]));

  return [...products].sort(
    (left, right) => (order.get(left.id) ?? 99) - (order.get(right.id) ?? 99),
  );
}

function sortTipProducts(products: Product[]): TipProduct[] {
  const order = new Map<string, number>(TIP_PRODUCT_IDS.map((id, index) => [id, index]));

  return products
    .map((product) => ({
      id: product.identifier,
      title: product.title,
      priceString: product.priceString,
    }))
    .sort((left, right) => (order.get(left.id) ?? 99) - (order.get(right.id) ?? 99));
}

export async function loadTipProducts(): Promise<TipProduct[]> {
  if (!isTipJarAvailable()) {
    return [];
  }

  const { isBillingSupported } = await NativePurchases.isBillingSupported();
  if (!isBillingSupported) {
    return [];
  }

  const { products } = await NativePurchases.getProducts({
    productIdentifiers: [...TIP_PRODUCT_IDS],
    productType: PURCHASE_TYPE.INAPP,
  });

  const loadedById = new Map(products.map((product) => [product.identifier, product]));
  const missingIds = TIP_PRODUCT_IDS.filter((id) => !loadedById.has(id));

  if (missingIds.length > 0) {
    const extraProducts = await Promise.all(
      missingIds.map(async (productIdentifier) => {
        try {
          const { product } = await NativePurchases.getProduct({
            productIdentifier,
            productType: PURCHASE_TYPE.INAPP,
          });
          return product;
        } catch {
          return null;
        }
      }),
    );

    for (const product of extraProducts) {
      if (product) {
        loadedById.set(product.identifier, product);
      }
    }
  }

  return sortTipProducts([...loadedById.values()]);
}

export async function purchaseTip(productId: string): Promise<void> {
  await NativePurchases.purchaseProduct({
    productIdentifier: productId,
    productType: PURCHASE_TYPE.INAPP,
    quantity: 1,
  });
}

export function mergeTipProducts(current: TipProduct[], next: TipProduct): TipProduct[] {
  const merged = new Map(current.map((product) => [product.id, product]));
  merged.set(next.id, next);
  return sortTipProductList([...merged.values()]);
}

export async function fetchTipProduct(productId: string): Promise<TipProduct | null> {
  try {
    const { product } = await NativePurchases.getProduct({
      productIdentifier: productId,
      productType: PURCHASE_TYPE.INAPP,
    });

    return {
      id: product.identifier,
      title: product.title,
      priceString: product.priceString,
    };
  } catch {
    return null;
  }
}

export function isTipPurchaseCancelled(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes('cancel') || message.includes('cancelled');
}
